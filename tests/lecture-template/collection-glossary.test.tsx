/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import type { CollectionValidationResult } from "../../src/lib/lecture-template/types";

afterEach(() => {
  cleanup();
});

function makeValidation(): CollectionValidationResult {
  return {
    lectureCount: 3,
    allPassed: false,
    courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
    results: [
      {
        slug: "01-intro",
        templatePath: "lectures/01-intro/lecture.template.md",
        valid: true,
        errors: [],
        template: {
          metadata: { title: "Intro", description: "", audience: "", duration: "10 minutes", level: "beginner" },
          overview: [],
          objectives: [],
          sections: [
            {
              title: "Basics",
              anchor: "basics",
              blocks: [
                {
                  kind: "component",
                  locator: { line: 1 },
                  component: { type: "glossary_term", term: "API", definition: "Application programming interface." }
                }
              ]
            }
          ],
          takeaways: []
        }
      },
      {
        slug: "02-core",
        templatePath: "lectures/02-core/lecture.template.md",
        valid: true,
        errors: [],
        template: {
          metadata: { title: "Core", description: "", audience: "", duration: "10 minutes", level: "beginner" },
          overview: [],
          objectives: [],
          sections: [
            {
              title: "Depth",
              anchor: "depth",
              blocks: [
                {
                  kind: "component",
                  locator: { line: 1 },
                  component: { type: "glossary_term", term: "API", definition: "Duplicate definition." }
                },
                {
                  kind: "component",
                  locator: { line: 2 },
                  component: { type: "glossary_term", term: "Schema", definition: "A contract." }
                }
              ]
            }
          ],
          takeaways: []
        }
      },
      {
        slug: "03-broken",
        templatePath: "lectures/03-broken/lecture.template.md",
        valid: false,
        errors: [{ code: "PARSE_ERROR", message: "broken" }]
      }
    ]
  };
}

describe("collection landing glossary index", () => {
  it("aggregates glossary terms across valid lectures and omits invalid ones", () => {
    const { container } = render(<CollectionLanding validation={makeValidation()} />);

    const desktop = container.querySelector(".glossary-index-desktop");
    expect(desktop).toBeTruthy();
    expect(desktop!.textContent).toContain("API");
    expect(desktop!.textContent).toContain("Schema");
    expect(screen.getAllByText("2 terms").length).toBeGreaterThan(0);
  });

  it("appears below the assessment index disclosure", () => {
    const html = renderCollectionHtml(makeValidation());
    const assessmentIndex = html.indexOf("assessment-index-disclosure");
    const glossaryIndex = html.indexOf("collection-glossary-index");

    expect(assessmentIndex).toBeGreaterThan(-1);
    expect(glossaryIndex).toBeGreaterThan(assessmentIndex);
  });
});

function renderCollectionHtml(validation: CollectionValidationResult): string {
  const { container } = render(<CollectionLanding validation={validation} />);
  return container.innerHTML;
}
