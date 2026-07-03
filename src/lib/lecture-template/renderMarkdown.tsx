import type { ReactNode } from "react";
import type { RenderBlock } from "./types";
import { CodeBlock } from "@/components/lecture-kit/CodeBlock";

export function renderMarkdownBlocks(blocks: RenderBlock[]): ReactNode[] {
  return blocks.map((block, index) => renderBlock(block, index));
}

function renderBlock(block: RenderBlock, index: number): ReactNode {
  if (block.kind === "paragraph") {
    return <p key={key(block, index)}>{block.text}</p>;
  }

  if (block.kind === "bullet_list") {
    return (
      <ul key={key(block, index)}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === "numbered_list") {
    return (
      <ol key={key(block, index)}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{item}</li>
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
    return <Heading key={key(block, index)}>{block.text}</Heading>;
  }

  return null;
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
              <th key={index}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
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
