import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

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
});
