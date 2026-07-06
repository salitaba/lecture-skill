/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("assessment index disclosure", () => {
  it("renders assessment index behind a disclosure element", () => {
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

    const summary = screen.getByText("Show 4 assessments").closest("summary")!;
    const details = summary.closest("details");
    expect(details).toBeInTheDocument();
    expect(details?.tagName).toBe("DETAILS");
    expect(details).toHaveClass("assessment-index-disclosure");
  });

  it("uses appropriate disclosure label", () => {
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

    expect(screen.getByText("Show 4 assessments")).toBeInTheDocument();
    expect(screen.getByText("Hide 4 assessments")).toBeInTheDocument();
  });

  it("disclosure can be toggled by keyboard", async () => {
    const user = userEvent.setup();
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

    const summary = screen.getByText("Show 4 assessments").closest("summary")!;
    summary.focus();
    expect(summary).toHaveFocus();

    await user.keyboard("{Enter}");

    const details = summary.closest("details");
    expect(details).toBeTruthy();
  });

  it("assessment content is accessible when disclosed", () => {
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

    const details = screen.getByText("Show 4 assessments").closest("details");
    expect(details).toBeTruthy();
    expect(details!.open).toBe(false);
  });
});
