/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

afterEach(() => {
  cleanup();
});

function validLecture(relativePath: string) {
  const result = validateTemplateSource(fixture(relativePath));
  if (!result.valid) throw new Error(`${relativePath} should be valid`);
  return result.template;
}

describe("collection landing view all lectures anchor", () => {
  it("renders a View all lectures anchor linking to the lecture list", () => {
    const lecture = validLecture("examples/component-demo.template.md");
    render(
      <CollectionLanding
        validation={{
          lectureCount: 1,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            { slug: "01-demo", templatePath: "lectures/01-demo/lecture.template.md", valid: true, errors: [], template: lecture }
          ]
        }}
      />
    );

    const anchor = screen.getByRole("link", { name: "View all lectures" });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "#lecture-list");
    expect(anchor).toHaveClass("collection-view-all-lectures");
  });

  it("targets the lecture list section by id", () => {
    const lecture = validLecture("examples/component-demo.template.md");
    const { container } = render(
      <CollectionLanding
        validation={{
          lectureCount: 1,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            { slug: "01-demo", templatePath: "lectures/01-demo/lecture.template.md", valid: true, errors: [], template: lecture }
          ]
        }}
      />
    );

    const lectureList = container.querySelector("#lecture-list");
    expect(lectureList).toBeInTheDocument();
    expect(lectureList?.tagName).toBe("OL");
  });

  it("anchor is keyboard reachable with visible focus", () => {
    const lecture = validLecture("examples/component-demo.template.md");
    render(
      <CollectionLanding
        validation={{
          lectureCount: 1,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            { slug: "01-demo", templatePath: "lectures/01-demo/lecture.template.md", valid: true, errors: [], template: lecture }
          ]
        }}
      />
    );

    const anchor = screen.getByRole("link", { name: "View all lectures" });
    expect(anchor).toHaveAttribute("href", "#lecture-list");
    expect(anchor.tagName).toBe("A");
  });
});
