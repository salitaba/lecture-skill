import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isCollectionMode, scanLectureCollection, validateCollection } from "../../src/lib/lecture-template/collection";
import { collectCollectionAssessments, collectLectureAnswerKey, collectLectureAssessments } from "../../src/lib/lecture-template/assessments";
import { parseCourseMetadata } from "../../src/lib/lecture-template/courseMetadata";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";

const repoRoot = process.cwd();
const supportedComponentTypes = [
  "callout",
  "concept_card",
  "step_list",
  "code_block",
  "comparison",
  "summary",
  "quote",
  "quiz",
  "question_set",
  "free_response",
  "practice_task",
  "diagram"
];
let tempRoot = "";

describe("collection scanning", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-collection-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("returns false when lectures is missing", async () => {
    expect(await isCollectionMode()).toBe(false);
  });

  it("returns false when lectures has no valid lecture directories", async () => {
    mkdirSync(path.join(tempRoot, "lectures", "03-empty"), { recursive: true });

    expect(await isCollectionMode()).toBe(false);
  });

  it("includes only matching lecture directories and sorts by numeric prefix", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    copyFixture(
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md"
    );
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/10-appendix/lecture.template.md");

    mkdirSync(path.join(tempRoot, "lectures", "03-empty"), { recursive: true });
    mkdirSync(path.join(tempRoot, "lectures", "notes"), { recursive: true });
    writeText("lectures/notes/lecture.template.md", "placeholder");

    const collection = await scanLectureCollection();

    expect(collection.basePath).toBe("lectures");
    expect(collection.entries.map((entry) => entry.slug)).toEqual(["01-introduction", "02-core-concepts", "10-appendix"]);
    expect(collection.entries.map((entry) => entry.order)).toEqual([1, 2, 10]);
    expect(collection.entries.map((entry) => entry.templatePath)).toEqual([
      "lectures/01-introduction/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md",
      "lectures/10-appendix/lecture.template.md"
    ]);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("notes"));

    warnSpy.mockRestore();
  });

  it("validates every lecture independently", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/invalid/invalid-level.template.md", "lectures/02-core-concepts/lecture.template.md");

    const validation = await validateCollection();

    expect(validation.lectureCount).toBe(2);
    expect(validation.results).toHaveLength(2);
    expect(validation.allPassed).toBe(false);
    expect(validation.results[0]).toMatchObject({
      slug: "01-introduction",
      valid: true
    });
    expect(validation.results[0].template?.metadata.title).toBe("Opening The Collection");
    expect(validation.results[1]).toMatchObject({
      slug: "02-core-concepts",
      valid: false
    });
    expect(validation.results[1].template?.metadata.title).toBe("Invalid Level");
    expect(validation.results[1].errors.map((error) => error.code)).toContain("INVALID_LEVEL");
  });

  it("parses valid course metadata and ignores unknown fields", () => {
    const result = parseCourseMetadata(
      [
        'title: "Course Title"',
        'description: "Course description."',
        'audience: "Technical educators"',
        'level: "intermediate"',
        'duration: "3 hours"',
        'extra_field: "ignored"',
        ""
      ].join("\n")
    );

    expect(result.status).toBe("valid");
    expect(result.status === "valid" ? result.metadata : undefined).toEqual({
      title: "Course Title",
      description: "Course description.",
      audience: "Technical educators",
      level: "intermediate",
      duration: "3 hours"
    });
  });

  it("reports field-specific course metadata errors", () => {
    const result = parseCourseMetadata(["title: '   '", "description: 42", "level: expert", ""].join("\n"));

    expect(result.status).toBe("invalid");
    expect(result.errors.map((error) => error.code)).toEqual([
      "COURSE_METADATA_REQUIRED_FIELD",
      "COURSE_METADATA_FIELD_TYPE",
      "COURSE_METADATA_INVALID_LEVEL"
    ]);
    expect(result.errors.map((error) => error.field)).toEqual(["title", "description", "level"]);
  });

  it("rejects non-mapping course metadata roots", () => {
    const result = parseCourseMetadata("- title");

    expect(result.status).toBe("invalid");
    expect(result.errors[0]).toMatchObject({
      code: "COURSE_METADATA_ROOT_TYPE"
    });
  });

  it("threads valid course metadata through scan and validation", async () => {
    writeText(
      "lectures/course.yaml",
      ['title: "Course Title"', 'description: "Course description."', 'audience: "Technical learners"', 'level: "beginner"', ""].join("\n")
    );
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );

    const collection = await scanLectureCollection();
    const validation = await validateCollection();

    expect(collection.courseMetadata.status).toBe("valid");
    expect(validation.courseMetadata.status).toBe("valid");
    expect(validation.allPassed).toBe(true);
  });

  it("makes invalid course metadata fail collection validation without hiding lecture results", async () => {
    writeText("lectures/course.yaml", "title: ''\ndescription: ''\n");
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );

    const validation = await validateCollection();

    expect(validation.lectureCount).toBe(1);
    expect(validation.results[0]).toMatchObject({ valid: true });
    expect(validation.courseMetadata.status).toBe("invalid");
    expect(validation.allPassed).toBe(false);
  });

  it("validates collection lectures that contain learning components", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/component-demo.template.md", "lectures/02-learning-components/lecture.template.md");

    const validation = await validateCollection();

    expect(validation.lectureCount).toBe(2);
    expect(validation.allPassed).toBe(true);
    expect(validation.results[1]).toMatchObject({
      slug: "02-learning-components",
      valid: true
    });
    const componentTypes =
      validation.results[1].template?.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component.type] : []))
      ) ?? [];

    expect(new Set(componentTypes)).toEqual(new Set(supportedComponentTypes));
    for (const componentType of supportedComponentTypes) {
      expect(componentTypes).toContain(componentType);
    }
  });

  it("collects assessment summaries and answer keys in source order", () => {
    const result = validateTemplateSource(readFileSync(path.join(repoRoot, "examples/component-demo.template.md"), "utf8"));
    expect(result.valid).toBe(true);
    if (!result.valid) return;

    const summaries = collectLectureAssessments(result.template, "01-demo");
    const answerKey = collectLectureAnswerKey(result.template, "01-demo");

    expect(summaries.map((summary) => summary.type)).toEqual(["quiz", "question_set", "free_response", "practice_task"]);
    expect(summaries[1]).toMatchObject({
      lectureSlug: "01-demo",
      sectionTitle: "Check Understanding Components",
      type: "question_set",
      title: "Component Review Questions"
    });
    expect(answerKey[0].answer).toBe("npm run validate");
    expect(answerKey[1].questions?.[0].answer).toBe("question_set");
    expect(answerKey[2].guidance).toContain("drafted answer");
    expect(answerKey[3].rubric?.[0]).toEqual({
      criterion: "Schema correctness",
      expected: "The assessment validates without INVALID_COMPONENT_FIELD errors."
    });
  });

  it("collects collection assessment index entries from valid lectures only", () => {
    const result = validateTemplateSource(readFileSync(path.join(repoRoot, "examples/component-demo.template.md"), "utf8"));
    expect(result.valid).toBe(true);
    if (!result.valid) return;

    const summaries = collectCollectionAssessments({
      lectureCount: 2,
      allPassed: false,
      courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
      results: [
        { slug: "01-demo", templatePath: "lectures/01-demo/lecture.template.md", valid: true, errors: [], template: result.template },
        { slug: "02-invalid", templatePath: "lectures/02-invalid/lecture.template.md", valid: false, errors: [] }
      ]
    });

    expect(summaries).toHaveLength(4);
    expect(new Set(summaries.map((summary) => summary.lectureSlug))).toEqual(new Set(["01-demo"]));
  });
});

function copyFixture(sourcePath: string, destinationPath: string) {
  const source = readFileSync(path.join(repoRoot, sourcePath), "utf8");
  writeText(destinationPath, source);
}

function writeText(destinationPath: string, contents: string) {
  const absolutePath = path.join(tempRoot, destinationPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}
