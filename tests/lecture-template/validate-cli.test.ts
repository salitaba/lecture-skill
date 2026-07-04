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
    expect(result.stderr).toContain("component=flashcard");
    expect(result.stderr).toContain("section=Valid Section");
    expect(result.stderr).toContain("Location: line");
    expect(result.stderr).toContain("Hint:");
    expect(result.stderr).toContain("comparison");
    expect(result.stderr).toContain("quiz");
  });

  it("prints precise fields for nested learning component failures", async () => {
    const comparisonResult = await validateTemplateFile("examples/invalid/comparison-field-errors.template.md");
    const quizResult = await validateTemplateFile("examples/invalid/quiz-field-errors.template.md");

    expect(comparisonResult.status).not.toBe(0);
    expect(comparisonResult.stderr).toContain("component=comparison");
    expect(comparisonResult.stderr).toContain("section=Comparison Problems");
    expect(comparisonResult.stderr).toContain("field=items[0].label");
    expect(comparisonResult.stderr).toContain("field=items[0].left");
    expect(comparisonResult.stderr).toContain("field=items[0].right");

    expect(quizResult.status).not.toBe(0);
    expect(quizResult.stderr).toContain("component=quiz");
    expect(quizResult.stderr).toContain("section=Quiz Problems");
    expect(quizResult.stderr).toContain("field=options[0]");
    expect(quizResult.stderr).toContain("field=answer");
  });
});
