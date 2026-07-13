/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function validLecture(relativePath: string) {
  const result = validateTemplateSource(fixture(relativePath));
  if (!result.valid) throw new Error(`${relativePath} should be valid`);
  return result.template;
}

function renderTwoLectureCollection() {
  const first = validLecture("examples/multi-lecture/lectures/01-introduction/lecture.template.md");
  const second = validLecture("examples/multi-lecture/lectures/02-core-concepts/lecture.template.md");

  return render(
    <CollectionLanding
      validation={{
        lectureCount: 2,
        allPassed: true,
        courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
        results: [
          { slug: "01-introduction", templatePath: "lectures/01-introduction/lecture.template.md", valid: true, errors: [], template: first },
          { slug: "02-core-concepts", templatePath: "lectures/02-core-concepts/lecture.template.md", valid: true, errors: [], template: second }
        ]
      }}
    />
  );
}

describe("collection landing learner-facing lecture state", () => {
  it("never renders authoring/validation PASS-FAIL status", () => {
    renderTwoLectureCollection();

    expect(screen.queryByText("PASS")).not.toBeInTheDocument();
    expect(screen.queryByText("FAIL")).not.toBeInTheDocument();
    expect(document.querySelector(".validation-badge")).not.toBeInTheDocument();
  });

  it("highlights the first lecture as the resume target when nothing has started", async () => {
    renderTwoLectureCollection();

    await waitFor(() => expect(screen.getByText("Resume here")).toBeInTheDocument());

    const items = document.querySelectorAll(".lecture-list-item");
    expect(items[0]).toHaveClass("lecture-list-item-resume");
    expect(items[1]).not.toHaveClass("lecture-list-item-resume");
    expect(screen.getByText("Not started")).toBeInTheDocument();
  });

  it("suppresses course-matching audience and level facts while retaining differing lecture facts", async () => {
    const first = validLecture("examples/multi-lecture/lectures/01-introduction/lecture.template.md");
    const second = validLecture("examples/multi-lecture/lectures/02-core-concepts/lecture.template.md");
    render(
      <CollectionLanding
        validation={{
          lectureCount: 2,
          allPassed: true,
          courseMetadata: {
            status: "valid",
            path: "lectures/course.yaml",
            errors: [],
            metadata: {
              title: "Course",
              description: "Course description.",
              audience: first.metadata.audience,
              level: first.metadata.level
            }
          },
          results: [
            { slug: "01-introduction", templatePath: "lectures/01-introduction/lecture.template.md", valid: true, errors: [], template: first },
            { slug: "02-core-concepts", templatePath: "lectures/02-core-concepts/lecture.template.md", valid: true, errors: [], template: second }
          ]
        }}
      />
    );

    await waitFor(() => expect(document.querySelectorAll(".lecture-list-item")).toHaveLength(2));
    const items = document.querySelectorAll(".lecture-list-item");
    const firstLabels = Array.from(items[0]?.querySelectorAll(".lecture-list-meta dt") ?? []).map((label) => label.textContent);
    const secondLabels = Array.from(items[1]?.querySelectorAll(".lecture-list-meta dt") ?? []).map((label) => label.textContent);
    expect(firstLabels).not.toContain("Audience");
    expect(firstLabels).not.toContain("Level");
    expect(secondLabels).toContain("Level");
  });
});
