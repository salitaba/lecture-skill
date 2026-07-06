/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import type { CollectionValidationResult } from "../../src/lib/lecture-template/types";

afterEach(() => {
  cleanup();
});

function getComputedWidth(element: HTMLElement): number {
  return element.getBoundingClientRect().width;
}

function makeValidation(): CollectionValidationResult {
  return {
    lectureCount: 1,
    allPassed: true,
    courseMetadata: { status: "absent" as const, path: "lectures/course.yaml", errors: [] },
    results: [
      {
        slug: "01-intro",
        templatePath: "lectures/01-intro/lecture.template.md",
        valid: true,
        errors: [],
        template: {
          metadata: { title: "Intro", description: "An introduction.", audience: "", duration: "10 minutes", level: "beginner" as const },
          overview: [],
          objectives: [],
          sections: [
            {
              title: "Basics",
              anchor: "basics",
              blocks: [
                {
                  kind: "component" as const,
                  locator: { line: 1 },
                  component: { type: "quiz" as const, anchor: "q1", question: "What is X?", options: ["A", "B"], answer: "A" }
                }
              ]
            }
          ],
          takeaways: []
        }
      }
    ]
  };
}

describe("visual hierarchy", () => {
  it("renders no horizontal overflow at mobile viewport", () => {
    const { container } = render(<CollectionLanding validation={makeValidation()} />);
    const section = container.querySelector(".collection-landing") as HTMLElement;
    const bodyWidth = document.body.getBoundingClientRect().width;
    const sectionWidth = getComputedWidth(section);

    expect(sectionWidth).toBeLessThanOrEqual(bodyWidth + 1);
  });

  it("collection-summary has no heavy card treatment", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);
    const summaryMatch = html.match(/class="collection-summary"[^>]*style="([^"]*)"/);
    const summaryStyle = summaryMatch?.[1] ?? "";

    expect(summaryStyle).not.toContain("border: 1px solid");
    expect(summaryStyle).not.toContain("border-radius: 8px");
  });

  it("lecture-list-meta items use lightweight treatment", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);
    const metaItems = html.match(/class="lecture-list-meta"[\s\S]*?<\/dl>/);

    expect(metaItems).toBeTruthy();
    if (metaItems) {
      expect(metaItems[0]).not.toContain('background: var(--surface)');
      expect(metaItems[0]).not.toContain('border: 1px solid');
    }
  });

  it("assessment index uses details element for disclosure", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);

    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("assessment-index-disclosure");
  });

  it("assessment index groups items by lecture", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);

    expect(html).toContain("assessment-group-title");
    expect(html).toContain("assessment-group-items");
    expect(html).toContain("assessment-group-meta");
  });

  it("lecture nav uses pill-shaped links", () => {
    const html = renderToStaticMarkup(
      <nav className="lecture-nav" aria-label="Test navigation">
        <div className="lecture-nav-inner">
          <span className="lecture-nav-link lecture-nav-prev">Previous</span>
          <span className="lecture-nav-link lecture-nav-back">Back to course</span>
          <span className="lecture-nav-link lecture-nav-next">Next</span>
        </div>
      </nav>
    );

    expect(html).toContain("lecture-nav-link");
    expect(html).toContain("lecture-nav-prev");
    expect(html).toContain("lecture-nav-back");
    expect(html).toContain("lecture-nav-next");
  });

  it("collection landing has primary action element", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);

    expect(html).toContain("collection-primary-action");
    expect(html).toContain("Start course");
  });
});
