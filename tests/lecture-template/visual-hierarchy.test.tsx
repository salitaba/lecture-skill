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
    expect(html).toContain('class="facts-list facts-list-default collection-summary"');
    expect(html).not.toContain("passing");
    expect(html).toContain("Estimated study time");
    expect(html).toContain("<dt>Lectures</dt>");
  });

  it("lecture-list-meta items use lightweight treatment", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);
    const metaItems = html.match(/class="facts-list facts-list-compact lecture-list-meta"[\s\S]*?<\/dl>/);

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

  it("keeps long course descriptions fully reachable through native disclosure", () => {
    const validation = makeValidation();
    const fullDescription =
      "This course follows a careful path from evidence collection to practical decisions. Learners compare observations, test explanations, and document the reasoning that makes technical work easier to review and repeat.";
    validation.courseMetadata = {
      status: "valid",
      path: "lectures/course.yaml",
      errors: [],
      metadata: {
        title: "Evidence Course",
        description: fullDescription,
        audience: "Engineers",
        level: "beginner",
        duration: "30 minutes"
      }
    };

    const html = renderToStaticMarkup(<CollectionLanding validation={validation} />);
    expect(html).toContain("course-description-disclosure");
    expect(html).toContain("About this course");
    expect(html).toContain(fullDescription);
    expect(html).toContain('class="facts-list facts-list-compact course-secondary-facts"');
  });

  it("uses semantic facts wrappers with no browser definition-list indentation contract", () => {
    const html = renderToStaticMarkup(<CollectionLanding validation={makeValidation()} />);
    expect((html.match(/class="facts-list/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('class="facts-list-item"');
    expect(html).toContain("<dt>");
    expect(html).toContain("<dd>");
  });
});
