import { parseDocument } from "yaml";
import { uniqueSectionAnchors } from "./anchors";
import type {
  MarkdownBlock,
  ParsedComponentBlock,
  ParsedHeading,
  ParsedLectureTemplate,
  ParseError,
  SourceLocator
} from "./types";

type SectionTarget = "pre" | "overview" | "objectives" | "section" | "takeaways";

interface MutableArea {
  target: SectionTarget;
  sectionIndex?: number;
}

const headingPattern = /^##\s+(.+?)\s*$/;

export function parseLectureTemplate(source: string): ParsedLectureTemplate {
  const allLines = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const errors: ParseError[] = [];
  const { frontmatter, bodyLines, bodyStartLine, frontmatterErrors } = parseFrontmatter(allLines);
  errors.push(...frontmatterErrors);

  const template: ParsedLectureTemplate = {
    frontmatter,
    preOverviewContent: [],
    sections: [],
    headings: [],
    errors
  };

  const anchors = uniqueSectionAnchors(
    bodyLines
      .map((line) => line.match(/^##\s+Section:\s*(.*?)\s*$/)?.[1])
      .filter((title): title is string => title !== undefined)
  );
  let sectionAnchorIndex = 0;
  let current: MutableArea = { target: "pre" };
  let index = 0;

  const pushBlock = (block: MarkdownBlock, area = current) => {
    if (area.target === "pre") template.preOverviewContent.push(block);
    if (area.target === "overview") template.overview?.blocks.push(block);
    if (area.target === "objectives") template.objectives?.blocks.push(block);
    if (area.target === "takeaways") template.takeaways?.blocks.push(block);
    if (area.target === "section" && area.sectionIndex !== undefined) {
      template.sections[area.sectionIndex]?.blocks.push(block);
    }
  };

  while (index < bodyLines.length) {
    const line = bodyLines[index] ?? "";
    const absoluteLine = bodyStartLine + index;
    const heading = line.match(headingPattern);

    if (heading) {
      const headingText = heading[1].trim();
      const parsedHeading = parseHeading(headingText, absoluteLine);
      template.headings.push(parsedHeading);

      if (parsedHeading.kind === "Overview") {
        template.overview = { locator: { line: absoluteLine, context: "## Overview" }, blocks: [] };
        current = { target: "overview" };
      } else if (parsedHeading.kind === "Learning Objectives") {
        template.objectives = {
          locator: { line: absoluteLine, context: "## Learning Objectives" },
          blocks: []
        };
        current = { target: "objectives" };
      } else if (parsedHeading.kind === "Section") {
        const sectionIndex = template.sections.length;
        template.sections.push({
          title: parsedHeading.title ?? "",
          locator: { line: absoluteLine, context: line.trim() },
          blocks: [],
          anchor: anchors[sectionAnchorIndex++] ?? `section-${sectionIndex + 1}`
        });
        current = { target: "section", sectionIndex };
      } else if (parsedHeading.kind === "Key Takeaways") {
        template.takeaways = {
          locator: { line: absoluteLine, context: "## Key Takeaways" },
          blocks: []
        };
        current = { target: "takeaways" };
      } else {
        pushBlock({
          kind: "heading",
          depth: 2,
          text: headingText,
          locator: { line: absoluteLine, context: line.trim() }
        });
      }

      index += 1;
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const { block, nextIndex } = parseFence(bodyLines, index, bodyStartLine, current, template, errors);
      pushBlock(block);
      index = nextIndex;
      continue;
    }

    const headingBlock = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (headingBlock) {
      pushBlock({
        kind: "heading",
        depth: headingBlock[1].length,
        text: headingBlock[2].trim(),
        locator: { line: absoluteLine, context: line.trim() }
      });
      index += 1;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const start = index;
      const items: string[] = [];
      const itemLocators: SourceLocator[] = [];
      while (index < bodyLines.length && /^\s*[-*+]\s+/.test(bodyLines[index] ?? "")) {
        const itemLine = bodyStartLine + index;
        items.push((bodyLines[index] ?? "").replace(/^\s*[-*+]\s+/, "").trim());
        itemLocators.push({ line: itemLine, context: (bodyLines[index] ?? "").trim() });
        index += 1;
        while (
          index < bodyLines.length &&
          isListContinuation(bodyLines[index] ?? "") &&
          !/^\s*[-*+]\s+/.test(bodyLines[index] ?? "") &&
          !/^\s*\d+\.\s+/.test(bodyLines[index] ?? "")
        ) {
          items[items.length - 1] = `${items[items.length - 1]} ${(bodyLines[index] ?? "").trim()}`.trim();
          index += 1;
        }
      }
      pushBlock({ kind: "bullet_list", items, itemLocators, locator: { line: bodyStartLine + start } });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const start = index;
      const items: string[] = [];
      const itemLocators: SourceLocator[] = [];
      while (index < bodyLines.length && /^\s*\d+\.\s+/.test(bodyLines[index] ?? "")) {
        const itemLine = bodyStartLine + index;
        items.push((bodyLines[index] ?? "").replace(/^\s*\d+\.\s+/, "").trim());
        itemLocators.push({ line: itemLine, context: (bodyLines[index] ?? "").trim() });
        index += 1;
        while (
          index < bodyLines.length &&
          isListContinuation(bodyLines[index] ?? "") &&
          !/^\s*[-*+]\s+/.test(bodyLines[index] ?? "") &&
          !/^\s*\d+\.\s+/.test(bodyLines[index] ?? "")
        ) {
          items[items.length - 1] = `${items[items.length - 1]} ${(bodyLines[index] ?? "").trim()}`.trim();
          index += 1;
        }
      }
      pushBlock({ kind: "numbered_list", items, itemLocators, locator: { line: bodyStartLine + start } });
      continue;
    }

    if (line.trim().startsWith("|") && line.includes("|")) {
      const start = index;
      const rows: string[] = [];
      while (
        index < bodyLines.length &&
        (bodyLines[index] ?? "").trim().startsWith("|") &&
        (bodyLines[index] ?? "").includes("|")
      ) {
        rows.push((bodyLines[index] ?? "").trim());
        index += 1;
      }
      pushBlock({ kind: "table", rows, locator: { line: bodyStartLine + start } });
      continue;
    }

    const start = index;
    const paragraphLines: string[] = [];
    while (index < bodyLines.length) {
      const next = bodyLines[index] ?? "";
      if (
        next.trim() === "" ||
        headingPattern.test(next) ||
        next.startsWith("```") ||
        /^\s*[-*+]\s+/.test(next) ||
        /^\s*\d+\.\s+/.test(next) ||
        /^(#{1,6})\s+/.test(next) ||
        (next.trim().startsWith("|") && next.includes("|"))
      ) {
        break;
      }
      paragraphLines.push(next.trim());
      index += 1;
    }
    pushBlock({
      kind: "paragraph",
      text: paragraphLines.join(" "),
      locator: { line: bodyStartLine + start }
    });
  }

  return template;
}

function parseFrontmatter(lines: string[]) {
  const errors: ParseError[] = [];
  if ((lines[0] ?? "").trim() !== "---") {
    return {
      frontmatter: { value: {}, locator: { line: 1, context: "frontmatter" }, raw: "" },
      bodyLines: lines,
      bodyStartLine: 1,
      frontmatterErrors: errors
    };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex === -1) {
    errors.push({
      code: "UNCLOSED_FRONTMATTER",
      message: "Frontmatter starts with --- but does not have a closing --- line.",
      locator: { line: 1, context: "frontmatter" },
      hint: "Add a closing --- line after the YAML frontmatter."
    });
    return {
      frontmatter: { value: {}, locator: { line: 1, context: "frontmatter" }, raw: lines.slice(1).join("\n") },
      bodyLines: [],
      bodyStartLine: lines.length + 1,
      frontmatterErrors: errors
    };
  }

  const raw = lines.slice(1, closingIndex).join("\n");
  const document = parseDocument(raw);
  const value = document.toJS() as unknown;
  for (const error of document.errors) {
    errors.push(yamlError("INVALID_FRONTMATTER_YAML", "Invalid frontmatter YAML.", error, 2, "frontmatter"));
  }

  return {
    frontmatter: {
      value: isRecord(value) ? value : {},
      locator: { line: 1, context: "frontmatter" },
      raw
    },
    bodyLines: lines.slice(closingIndex + 1),
    bodyStartLine: closingIndex + 2,
    frontmatterErrors: errors
  };
}

function parseHeading(text: string, line: number): ParsedHeading {
  if (text === "Overview") return { kind: "Overview", text, locator: { line, context: "## Overview" } };
  if (text === "Learning Objectives") {
    return { kind: "Learning Objectives", text, locator: { line, context: "## Learning Objectives" } };
  }
  if (text === "Key Takeaways") {
    return { kind: "Key Takeaways", text, locator: { line, context: "## Key Takeaways" } };
  }
  const section = text.match(/^Section:\s*(.*?)\s*$/);
  if (section) {
    return {
      kind: "Section",
      text,
      title: section[1],
      locator: { line, context: `## ${text}` }
    };
  }
  return { kind: "Other", text, locator: { line, context: `## ${text}` } };
}

function parseFence(
  lines: string[],
  startIndex: number,
  bodyStartLine: number,
  area: MutableArea,
  template: ParsedLectureTemplate,
  errors: ParseError[]
): { block: MarkdownBlock; nextIndex: number } {
  const opener = lines[startIndex] ?? "";
  const language = opener.replace(/^```/, "").trim();
  let endIndex = startIndex + 1;
  while (endIndex < lines.length && !(lines[endIndex] ?? "").startsWith("```")) {
    endIndex += 1;
  }

  const line = bodyStartLine + startIndex;
  const closed = endIndex < lines.length;
  const raw = lines.slice(startIndex + 1, closed ? endIndex : lines.length).join("\n");

  if (language === "lecture-component") {
    const componentErrors: ParseError[] = [];
    const sectionTitle =
      area.target === "section" && area.sectionIndex !== undefined ? template.sections[area.sectionIndex]?.title : undefined;
    if (!closed) {
      const error: ParseError = {
        code: "UNCLOSED_COMPONENT_FENCE",
        message: "A lecture-component fenced block is not closed.",
        locator: { line, context: "lecture-component" },
        sectionTitle,
        hint: "Add a closing ``` line after the component YAML."
      };
      componentErrors.push(error);
      errors.push(error);
    }

    const document = parseDocument(raw);
    const data = document.toJS();
    const componentType = isRecord(data) && typeof data.type === "string" ? data.type : undefined;
    for (const error of document.errors) {
      const parseError = yamlError(
        "MALFORMED_COMPONENT_YAML",
        "Malformed lecture-component YAML.",
        error,
        line + 1,
        "lecture-component"
      );
      parseError.sectionTitle = sectionTitle;
      parseError.componentType = componentType;
      componentErrors.push(parseError);
      errors.push(parseError);
    }

    const block: ParsedComponentBlock = {
      kind: "component",
      raw,
      data,
      locator: { line, context: "lecture-component" },
      sectionTitle,
      componentType,
      yamlErrors: componentErrors
    };
    return { block, nextIndex: closed ? endIndex + 1 : lines.length };
  }

  return {
    block: {
      kind: "code_fence",
      language,
      code: raw,
      locator: { line, context: language ? `code fence: ${language}` : "code fence" }
    },
    nextIndex: closed ? endIndex + 1 : lines.length
  };
}

function isListContinuation(line: string): boolean {
  return /^\s{2,}\S/.test(line) && !line.startsWith("```") && !headingPattern.test(line);
}

function yamlError(code: string, message: string, error: unknown, baseLine: number, context: string): ParseError {
  const linePos = (error as { linePos?: Array<{ line?: number; col?: number }> }).linePos?.[0];
  const pretty = (error as { message?: string }).message;
  return {
    code,
    message: pretty ? `${message} ${pretty}` : message,
    locator: {
      line: linePos?.line ? baseLine + linePos.line - 1 : baseLine,
      column: linePos?.col,
      context
    },
    hint: "Check the YAML indentation, quotes, and key/value syntax."
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
