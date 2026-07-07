import type { ReactNode } from "react";
import type { RenderBlock } from "./types";
import { CodeBlock } from "@/components/lecture-kit/CodeBlock";

export function renderMarkdownBlocks(blocks: RenderBlock[]): ReactNode[] {
  return blocks.map((block, index) => renderBlock(block, index));
}

function renderBlock(block: RenderBlock, index: number): ReactNode {
  if (block.kind === "paragraph") {
    return <p key={key(block, index)}>{renderInline(block.text)}</p>;
  }

  if (block.kind === "bullet_list") {
    return (
      <ul key={key(block, index)}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === "numbered_list") {
    return (
      <ol key={key(block, index)}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item)}</li>
        ))}
      </ol>
    );
  }

  if (block.kind === "code_fence") {
    return <CodeBlock key={key(block, index)} language={block.language || "text"} code={block.code} />;
  }

  if (block.kind === "table") {
    return <MarkdownTable key={key(block, index)} rows={block.rows} />;
  }

  if (block.kind === "heading") {
    const Heading = `h${Math.min(Math.max(block.depth, 3), 6)}` as "h3";
    return <Heading key={key(block, index)}>{renderInline(block.text)}</Heading>;
  }

  return null;
}

/** Matches the small set of inline markdown authors actually use in prose: **bold**, `code`, and *italic*.
    Order matters — bold must be tried before italic so `**x**` doesn't get split as two `*` matches. */
const inlineTokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;

export function renderInline(text: string): ReactNode {
  const parts = text.split(inlineTokenPattern).filter((part) => part !== "");
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function MarkdownTable({ rows }: { rows: string[] }) {
  const parsedRows = rows
    .map((row) =>
      row
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim())
    )
    .filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));

  const [header, ...body] = parsedRows;
  if (!header) return null;

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {header.map((cell, index) => (
              <th key={index}>{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function key(block: RenderBlock, index: number): string {
  return `${block.kind}-${block.locator?.line ?? index}-${index}`;
}
