import { describe, expect, it } from "vitest";
import { validateTemplateFile } from "../../src/lib/lecture-template/validateCli";

describe("validation CLI", () => {
  it("validates content/lecture.template.md by default", async () => {
    const result = await validateTemplateFile();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Valid lecture template: content/lecture.template.md");
  });

  it("prints locatable errors and exits nonzero for invalid templates", async () => {
    const result = await validateTemplateFile("examples/invalid/unsupported-component-type.template.md");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("UNSUPPORTED_COMPONENT_TYPE");
    expect(result.stderr).toContain("component=quiz");
    expect(result.stderr).toContain("section=Valid Section");
    expect(result.stderr).toContain("Location: line");
    expect(result.stderr).toContain("Hint:");
  });
});
