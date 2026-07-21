import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { errorCodes, fixture } from "./testUtils";

describe("validation fixtures", () => {
  it("valid example templates pass", () => {
    for (const filePath of [
      "content/lecture.template.md",
      "examples/golden.template.md",
      "examples/component-demo.template.md",
      "examples/ux-stress.template.md",
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md"
    ]) {
      expect(validateTemplateSource(fixture(filePath)), filePath).toMatchObject({ valid: true });
    }
  });

  it("all invalid fixtures fail validation", () => {
    const invalidDir = path.join(process.cwd(), "examples/invalid");
    const invalidFiles = readdirSync(invalidDir).filter((file) => file.endsWith(".template.md"));

    expect(invalidFiles.length).toBeGreaterThanOrEqual(20);
    for (const file of invalidFiles) {
      expect(validateTemplateSource(fixture(`examples/invalid/${file}`)), file).toMatchObject({ valid: false });
    }
  });

  it("registers learning-loop contract fixtures without touching authored source evidence", () => {
    const validFiles = [
      "tests/fixtures/learning-loop/objectives-explicit.template.md",
      "tests/fixtures/learning-loop/objectives-legacy.template.md",
      "tests/fixtures/learning-loop/collection/01-first/lecture.template.md",
      "tests/fixtures/learning-loop/collection/02-second/lecture.template.md"
    ];
    for (const filePath of validFiles) {
      expect(validateTemplateSource(fixture(filePath)), filePath).toMatchObject({ valid: true });
    }

    for (const filePath of [
      "tests/fixtures/learning-loop/objectives-invalid-markers.template.md",
      "tests/fixtures/learning-loop/objectives-duplicate-ids.template.md",
      "tests/fixtures/learning-loop/assessment-coverage.template.md",
      "tests/fixtures/learning-loop/collection/03-invalid/lecture.template.md"
    ]) {
      expect(validateTemplateSource(fixture(filePath)), filePath).toMatchObject({ valid: false });
    }
    expect(errorCodes("tests/fixtures/learning-loop/objectives-invalid-markers.template.md")).toContain("INVALID_OBJECTIVE_MARKER");
  });
});
