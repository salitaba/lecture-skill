import { parseLectureTemplate } from "./parseTemplate";
import type {
  LectureComponent,
  LectureComponentType,
  LectureLevel,
  MarkdownBlock,
  ParsedComponentBlock,
  ParsedLectureTemplate,
  RenderBlock,
  ValidationError,
  ValidationResult
} from "./types";

const requiredFrontmatter = ["title", "description", "audience", "duration", "level"] as const;
const allowedLevels: LectureLevel[] = ["beginner", "intermediate", "advanced"];
const allowedCalloutVariants = ["note", "warning", "insight"] as const;
const supportedComponents = [
  "callout",
  "concept_card",
  "step_list",
  "code_block",
  "comparison",
  "summary",
  "quote",
  "quiz"
] as const satisfies readonly LectureComponentType[];

export function validateTemplateSource(source: string): ValidationResult {
  return validateParsedTemplate(parseLectureTemplate(source));
}

export function validateParsedTemplate(parsed: ParsedLectureTemplate): ValidationResult {
  const errors: ValidationError[] = [];
  errors.push(...parsed.errors);

  validateFrontmatter(parsed, errors);
  validateHeadingStructure(parsed, errors);
  validateBody(parsed, errors);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const metadata = {
    title: stringValue(parsed.frontmatter.value.title),
    description: stringValue(parsed.frontmatter.value.description),
    audience: stringValue(parsed.frontmatter.value.audience),
    duration: stringValue(parsed.frontmatter.value.duration),
    level: stringValue(parsed.frontmatter.value.level) as LectureLevel
  };

  return {
    valid: true,
    errors: [],
    template: {
      metadata,
      overview: normalizeBlocks(parsed.overview?.blocks ?? []),
      objectives: collectBulletItems(parsed.objectives?.blocks ?? []),
      sections: parsed.sections.map((section) => ({
        title: section.title.trim(),
        anchor: section.anchor,
        blocks: normalizeBlocks(section.blocks)
      })),
      takeaways: collectBulletItems(parsed.takeaways?.blocks ?? [])
    }
  };
}

function validateFrontmatter(parsed: ParsedLectureTemplate, errors: ValidationError[]) {
  for (const field of requiredFrontmatter) {
    const value = parsed.frontmatter.value[field];
    if (typeof value !== "string" || value.trim() === "") {
      errors.push({
        code: "REQUIRED_FRONTMATTER_FIELD",
        message: `Required frontmatter field "${field}" is missing or empty.`,
        locator: parsed.frontmatter.locator,
        field,
        hint: `Add a non-empty ${field}: value to the YAML frontmatter.`
      });
    }
  }

  const level = parsed.frontmatter.value.level;
  if (typeof level === "string" && level.trim() !== "" && !allowedLevels.includes(level as LectureLevel)) {
    errors.push({
      code: "INVALID_LEVEL",
      message: `Invalid level "${level}".`,
      locator: parsed.frontmatter.locator,
      field: "level",
      hint: "Use one of: beginner, intermediate, advanced."
    });
  }
}

function validateHeadingStructure(parsed: ParsedLectureTemplate, errors: ValidationError[]) {
  const overviewHeadings = parsed.headings.filter((heading) => heading.kind === "Overview");
  const objectiveHeadings = parsed.headings.filter((heading) => heading.kind === "Learning Objectives");
  const sectionHeadings = parsed.headings.filter((heading) => heading.kind === "Section");
  const takeawayHeadings = parsed.headings.filter((heading) => heading.kind === "Key Takeaways");

  missingHeading(errors, overviewHeadings.length, "Overview");
  missingHeading(errors, objectiveHeadings.length, "Learning Objectives");
  missingHeading(errors, sectionHeadings.length, "Section");
  missingHeading(errors, takeawayHeadings.length, "Key Takeaways");

  duplicateHeading(errors, overviewHeadings, "Overview");
  duplicateHeading(errors, objectiveHeadings, "Learning Objectives");
  duplicateHeading(errors, takeawayHeadings, "Key Takeaways");

  const overviewLine = overviewHeadings[0]?.locator.line;
  const objectivesLine = objectiveHeadings[0]?.locator.line;
  const firstSectionLine = sectionHeadings[0]?.locator.line;
  const lastSectionLine = sectionHeadings[sectionHeadings.length - 1]?.locator.line;
  const takeawaysLine = takeawayHeadings[0]?.locator.line;
  const outOfOrder =
    (overviewLine !== undefined && objectivesLine !== undefined && objectivesLine < overviewLine) ||
    (objectivesLine !== undefined && firstSectionLine !== undefined && firstSectionLine < objectivesLine) ||
    (lastSectionLine !== undefined && takeawaysLine !== undefined && takeawaysLine < lastSectionLine) ||
    (overviewLine !== undefined && takeawaysLine !== undefined && takeawaysLine < overviewLine);

  if (outOfOrder) {
    errors.push({
      code: "OUT_OF_ORDER_HEADINGS",
      message: "Required body sections are out of order.",
      locator: { context: "required headings" },
      heading: "Overview > Learning Objectives > Section > Key Takeaways",
      hint: "Use this order: ## Overview, ## Learning Objectives, one or more ## Section: <title>, then ## Key Takeaways."
    });
  }
}

function validateBody(parsed: ParsedLectureTemplate, errors: ValidationError[]) {
  if (parsed.preOverviewContent.some((block) => blockHasText(block))) {
    const block = parsed.preOverviewContent.find((candidate) => blockHasText(candidate));
    errors.push({
      code: "CONTENT_BEFORE_OVERVIEW",
      message: "Non-empty body content appears before ## Overview.",
      locator: block?.locator,
      heading: "Overview",
      hint: "Move this content under ## Overview or a lecture section."
    });
  }

  if (parsed.overview && !parsed.overview.blocks.some((block) => block.kind === "paragraph" && block.text.trim())) {
    errors.push({
      code: "EMPTY_OVERVIEW",
      message: "## Overview must contain at least one non-empty paragraph.",
      locator: parsed.overview.locator,
      heading: "Overview",
      hint: "Add a short overview paragraph under ## Overview."
    });
  }

  if (parsed.objectives && collectBulletItems(parsed.objectives.blocks).length === 0) {
    errors.push({
      code: "EMPTY_LEARNING_OBJECTIVES",
      message: "## Learning Objectives must contain at least one Markdown bullet item.",
      locator: parsed.objectives.locator,
      heading: "Learning Objectives",
      hint: "Add one or more bullet items, for example: - Explain the main idea."
    });
  }

  if (parsed.takeaways && collectBulletItems(parsed.takeaways.blocks).length === 0) {
    errors.push({
      code: "EMPTY_KEY_TAKEAWAYS",
      message: "## Key Takeaways must contain at least one Markdown bullet item.",
      locator: parsed.takeaways.locator,
      heading: "Key Takeaways",
      hint: "Add one or more bullet items under ## Key Takeaways."
    });
  }

  for (const block of [
    ...parsed.preOverviewContent,
    ...(parsed.overview?.blocks ?? []),
    ...(parsed.objectives?.blocks ?? []),
    ...(parsed.takeaways?.blocks ?? [])
  ]) {
    if (block.kind === "component") {
      errors.push({
        code: "COMPONENT_OUTSIDE_SECTION",
        message: "lecture-component blocks are only allowed inside ## Section blocks.",
        locator: block.locator,
        componentType: block.componentType,
        hint: "Move the component under a ## Section: <section title> heading."
      });
    }
  }

  for (const section of parsed.sections) {
    if (section.title.trim() === "") {
      errors.push({
        code: "EMPTY_SECTION_TITLE",
        message: "A ## Section heading has an empty title.",
        locator: section.locator,
        sectionTitle: section.title,
        hint: "Use the format ## Section: A Meaningful Section Title."
      });
    }

    for (const block of section.blocks) {
      if (block.kind === "component") {
        validateComponent(block, errors, section.title);
      }
    }

    if (!section.blocks.some((block) => isMeaningfulSectionBlock(block))) {
      errors.push({
        code: "SECTION_WITHOUT_MEANINGFUL_CONTENT",
        message: `Section "${section.title || "(empty title)"}" has no meaningful content block.`,
        locator: section.locator,
        sectionTitle: section.title,
        hint: "Add a paragraph, list, code block, table, or valid supported lecture component."
      });
    }
  }
}

function validateComponent(block: ParsedComponentBlock, errors: ValidationError[], sectionTitle: string) {
  if (block.yamlErrors.length > 0) return;

  if (!isRecord(block.data)) {
    errors.push({
      code: "INVALID_COMPONENT_PAYLOAD",
      message: "lecture-component payload must be a YAML mapping.",
      locator: block.locator,
      sectionTitle,
      hint: "Use YAML keys such as type:, title:, and body: inside the component fence."
    });
    return;
  }

  const type = typeof block.data.type === "string" ? block.data.type : undefined;
  if (!type) {
    errors.push(componentFieldError(block, sectionTitle, "type", "Component is missing required field \"type\"."));
    return;
  }

  if (!supportedComponents.includes(type as (typeof supportedComponents)[number])) {
    errors.push({
      code: "UNSUPPORTED_COMPONENT_TYPE",
      message: `Unsupported component type "${type}".`,
      locator: block.locator,
      sectionTitle,
      componentType: type,
      hint: supportedComponentHint()
    });
    return;
  }

  if (type === "callout") {
    requireStringFields(block, sectionTitle, errors, ["title", "body"]);
    const variant = block.data.variant;
    if (typeof variant !== "string" || !allowedCalloutVariants.includes(variant as (typeof allowedCalloutVariants)[number])) {
      errors.push({
        code: "INVALID_COMPONENT_FIELD",
        message: "callout.variant must be one of note, warning, or insight.",
        locator: block.locator,
        sectionTitle,
        componentType: "callout",
        field: "variant",
        hint: "Set variant: note, variant: warning, or variant: insight."
      });
    }
  }

  if (type === "concept_card") {
    requireStringFields(block, sectionTitle, errors, ["title", "body"]);
  }

  if (type === "step_list") {
    requireStringFields(block, sectionTitle, errors, ["title"]);
    if (!Array.isArray(block.data.steps) || block.data.steps.length === 0 || !block.data.steps.every((step) => typeof step === "string" && step.trim())) {
      errors.push({
        code: "INVALID_COMPONENT_FIELD",
        message: "step_list.steps must be a non-empty YAML list of strings.",
        locator: block.locator,
        sectionTitle,
        componentType: "step_list",
        field: "steps",
        hint: "Add steps as a YAML list, for example: steps: [\"First\", \"Second\"]."
      });
    }
  }

  if (type === "code_block") {
    requireStringFields(block, sectionTitle, errors, ["language", "code"]);
  }

  if (type === "comparison") {
    requireStringFields(block, sectionTitle, errors, ["title"]);
    optionalStringFields(block, sectionTitle, errors, ["left_label", "right_label"]);
    validateComparisonItems(block, sectionTitle, errors);
  }

  if (type === "summary") {
    requireStringFields(block, sectionTitle, errors, ["title"]);
    validateStringListField(block, sectionTitle, errors, "items", { minimumItems: 1 });
  }

  if (type === "quote") {
    requireStringFields(block, sectionTitle, errors, ["quote"]);
    optionalStringFields(block, sectionTitle, errors, ["attribution", "context"]);
  }

  if (type === "quiz") {
    requireStringFields(block, sectionTitle, errors, ["question", "answer"]);
    optionalStringFields(block, sectionTitle, errors, ["explanation"]);
    const trimmedOptions = validateStringListField(block, sectionTitle, errors, "options", { minimumItems: 2 });
    const answer = stringValue(block.data.answer);
    if (answer && trimmedOptions.length >= 2 && !trimmedOptions.includes(answer)) {
      errors.push({
        code: "INVALID_COMPONENT_FIELD",
        message: "quiz.answer must exactly match one option.",
        locator: block.locator,
        sectionTitle,
        componentType: "quiz",
        field: "answer",
        hint: "Set answer: to the exact text of one quiz option after trimming whitespace."
      });
    }
  }
}

function requireStringFields(block: ParsedComponentBlock, sectionTitle: string, errors: ValidationError[], fields: string[]) {
  if (!isRecord(block.data)) return;
  for (const field of fields) {
    if (typeof block.data[field] !== "string" || String(block.data[field]).trim() === "") {
      errors.push(componentFieldError(block, sectionTitle, field, `${block.componentType ?? block.data.type} is missing required field "${field}".`));
    }
  }
}

function optionalStringFields(block: ParsedComponentBlock, sectionTitle: string, errors: ValidationError[], fields: string[]) {
  if (!isRecord(block.data)) return;
  for (const field of fields) {
    if (field in block.data && (typeof block.data[field] !== "string" || String(block.data[field]).trim() === "")) {
      errors.push(
        componentFieldError(block, sectionTitle, field, `${block.componentType ?? block.data.type}.${field} must be a non-empty string when present.`)
      );
    }
  }
}

function validateComparisonItems(block: ParsedComponentBlock, sectionTitle: string, errors: ValidationError[]) {
  if (!isRecord(block.data)) return;
  const items = block.data.items;
  if (!Array.isArray(items) || items.length === 0) {
    errors.push({
      code: "INVALID_COMPONENT_FIELD",
      message: "comparison.items must be a non-empty YAML list of mappings.",
      locator: block.locator,
      sectionTitle,
      componentType: "comparison",
      field: "items",
      hint: "Add comparison items with label, left, and right fields."
    });
    return;
  }

  items.forEach((item, index) => {
    if (!isRecord(item)) {
      errors.push({
        code: "INVALID_COMPONENT_FIELD",
        message: `comparison.items[${index}] must be a YAML mapping.`,
        locator: block.locator,
        sectionTitle,
        componentType: "comparison",
        field: `items[${index}]`,
        hint: "Use a YAML mapping such as - label: Ownership, left: Local, right: Shared."
      });
      return;
    }

    for (const field of ["label", "left", "right"] as const) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        errors.push({
          code: "INVALID_COMPONENT_FIELD",
          message: `comparison.items[${index}].${field} must be a non-empty string.`,
          locator: block.locator,
          sectionTitle,
          componentType: "comparison",
          field: `items[${index}].${field}`,
          hint: `Add a non-empty ${field}: value to this comparison item.`
        });
      }
    }
  });
}

function validateStringListField(
  block: ParsedComponentBlock,
  sectionTitle: string,
  errors: ValidationError[],
  field: string,
  options: { minimumItems: number }
): string[] {
  if (!isRecord(block.data)) return [];
  const value = block.data[field];
  const componentType = String(block.data.type);
  if (!Array.isArray(value) || value.length < options.minimumItems) {
    errors.push({
      code: "INVALID_COMPONENT_FIELD",
      message: `${componentType}.${field} must be a YAML list with at least ${options.minimumItems} ${options.minimumItems === 1 ? "item" : "items"}.`,
      locator: block.locator,
      sectionTitle,
      componentType,
      field,
      hint: `Add ${field}: as a YAML list of non-empty strings.`
    });
    return [];
  }

  const trimmed: string[] = [];
  value.forEach((item, index) => {
    if (typeof item !== "string" || item.trim() === "") {
      errors.push({
        code: "INVALID_COMPONENT_FIELD",
        message: `${componentType}.${field}[${index}] must be a non-empty string.`,
        locator: block.locator,
        sectionTitle,
        componentType,
        field: `${field}[${index}]`,
        hint: `Use a quoted string for ${field}[${index}].`
      });
      return;
    }
    trimmed.push(item.trim());
  });
  return trimmed;
}

function componentFieldError(block: ParsedComponentBlock, sectionTitle: string, field: string, message: string): ValidationError {
  return {
    code: "INVALID_COMPONENT_FIELD",
    message,
    locator: block.locator,
    sectionTitle,
    componentType: block.componentType,
    field,
    hint: `Add a valid ${field}: value to this component.`
  };
}

function isMeaningfulSectionBlock(block: MarkdownBlock): boolean {
  if (block.kind === "paragraph") return block.text.trim().length > 0;
  if (block.kind === "bullet_list" || block.kind === "numbered_list") return block.items.some((item) => item.trim());
  if (block.kind === "code_fence") return true;
  if (block.kind === "table") return block.rows.length > 0;
  if (block.kind === "component") {
    return isRecord(block.data) && supportedComponents.includes(block.data.type as (typeof supportedComponents)[number]) && block.yamlErrors.length === 0;
  }
  return false;
}

function blockHasText(block: MarkdownBlock): boolean {
  if (block.kind === "paragraph") return block.text.trim().length > 0;
  if (block.kind === "bullet_list" || block.kind === "numbered_list") return block.items.some((item) => item.trim());
  if (block.kind === "code_fence") return block.code.trim().length > 0;
  if (block.kind === "table") return block.rows.some((row) => row.trim());
  if (block.kind === "heading") return block.text.trim().length > 0;
  if (block.kind === "component") return true;
  return false;
}

function collectBulletItems(blocks: MarkdownBlock[]): string[] {
  return blocks.flatMap((block) => (block.kind === "bullet_list" ? block.items.filter((item) => item.trim()) : []));
}

function normalizeBlocks(blocks: MarkdownBlock[]): RenderBlock[] {
  return blocks.flatMap((block): RenderBlock[] => {
    if (block.kind !== "component") return [block];
    const component = normalizeComponent(block);
    return component ? [{ kind: "component", component, locator: block.locator }] : [];
  });
}

function normalizeComponent(block: ParsedComponentBlock): LectureComponent | undefined {
  if (!isRecord(block.data)) return undefined;
  const data = block.data;
  if (data.type === "callout") {
    return {
      type: "callout",
      variant: data.variant as "note" | "warning" | "insight",
      title: stringValue(data.title),
      body: stringValue(data.body)
    };
  }
  if (data.type === "concept_card") {
    return { type: "concept_card", title: stringValue(data.title), body: stringValue(data.body) };
  }
  if (data.type === "step_list") {
    return { type: "step_list", title: stringValue(data.title), steps: data.steps as string[] };
  }
  if (data.type === "code_block") {
    return { type: "code_block", language: stringValue(data.language), code: stringValue(data.code) };
  }
  if (data.type === "comparison") {
    const items = Array.isArray(data.items) ? data.items.filter(isRecord) : [];
    return {
      type: "comparison",
      title: stringValue(data.title),
      leftLabel: stringValue(data.left_label) || "Option A",
      rightLabel: stringValue(data.right_label) || "Option B",
      items: items.map((item) => ({
        label: stringValue(item.label),
        left: stringValue(item.left),
        right: stringValue(item.right)
      }))
    };
  }
  if (data.type === "summary") {
    return {
      type: "summary",
      title: stringValue(data.title),
      items: Array.isArray(data.items) ? data.items.map(stringValue) : []
    };
  }
  if (data.type === "quote") {
    const attribution = stringValue(data.attribution);
    const context = stringValue(data.context);
    return {
      type: "quote",
      quote: stringValue(data.quote),
      ...(attribution ? { attribution } : {}),
      ...(context ? { context } : {})
    };
  }
  if (data.type === "quiz") {
    const explanation = stringValue(data.explanation);
    return {
      type: "quiz",
      question: stringValue(data.question),
      options: Array.isArray(data.options) ? data.options.map(stringValue) : [],
      answer: stringValue(data.answer),
      ...(explanation ? { explanation } : {})
    };
  }
  return undefined;
}

function supportedComponentHint(): string {
  return `Use one of: ${supportedComponents.join(", ")}.`;
}

function missingHeading(errors: ValidationError[], count: number, heading: string) {
  if (count === 0) {
    errors.push({
      code: "MISSING_REQUIRED_SECTION",
      message: `Missing required section "## ${heading}${heading === "Section" ? ": <section title>" : ""}".`,
      heading,
      hint: "Add all required body sections in the supported order."
    });
  }
}

function duplicateHeading(errors: ValidationError[], headings: Array<{ locator: { line?: number }; kind: string }>, heading: string) {
  if (headings.length > 1) {
    errors.push({
      code: "DUPLICATE_REQUIRED_HEADING",
      message: `Duplicate ## ${heading} headings are not allowed.`,
      locator: headings[1]?.locator,
      heading,
      hint: `Keep exactly one ## ${heading} heading.`
    });
  }
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
