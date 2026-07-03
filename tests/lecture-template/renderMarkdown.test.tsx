import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMarkdownBlocks } from "../../src/lib/lecture-template/renderMarkdown";
import type { RenderBlock } from "../../src/lib/lecture-template/types";

describe("renderMarkdownBlocks", () => {
  it("renders raw HTML as escaped inert text", () => {
    const blocks: RenderBlock[] = [
      {
        kind: "paragraph",
        text: '<script>globalThis.bad = true</script><strong>not markup</strong>',
        locator: { line: 1 }
      }
    ];

    const html = renderToStaticMarkup(<>{renderMarkdownBlocks(blocks)}</>);

    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;strong&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<strong>not markup</strong>");
  });
});
