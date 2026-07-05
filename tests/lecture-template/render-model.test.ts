import { describe, expect, it } from "vitest";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

describe("render model", () => {
  it("valid templates produce nav entries for every section in order", () => {
    const result = validateTemplateSource(fixture("content/lecture.template.md"));

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.template.sections).toHaveLength(4);
      expect(result.template.sections.every((section) => section.title.trim().length > 0)).toBe(true);
      expect(new Set(result.template.sections.map((section) => section.anchor)).size).toBe(result.template.sections.length);
    }
  });

  it("keeps duplicate section titles navigable with unique anchors", () => {
    const result = validateTemplateSource(fixture("examples/ux-stress.template.md"));

    expect(result.valid).toBe(true);
    if (result.valid) {
      const duplicateSections = result.template.sections.filter((section) => section.title === "Duplicate Topic");

      expect(result.template.sections.length).toBeGreaterThanOrEqual(10);
      expect(duplicateSections).toHaveLength(2);
      expect(duplicateSections.map((section) => section.anchor)).toEqual(["duplicate-topic", "duplicate-topic-2"]);
      expect(new Set(result.template.sections.map((section) => section.anchor)).size).toBe(result.template.sections.length);
    }
  });

  it("invalid templates produce validation errors instead of a template", () => {
    const result = validateTemplateSource(fixture("examples/invalid/invalid-level.template.md"));

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.map((error) => error.code)).toContain("INVALID_LEVEL");
    }
  });

  it("normalizes advanced component blocks in the component demo render model", () => {
    const result = validateTemplateSource(fixture("examples/component-demo.template.md"));

    expect(result.valid).toBe(true);
    if (result.valid) {
      const componentTypes = result.template.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component.type] : []))
      );
      expect(componentTypes).toEqual(
        expect.arrayContaining([
          "glossary_term",
          "tabs",
          "accordion",
          "timeline",
          "checklist",
          "flashcard",
          "worked_example",
          "mistake_correction",
          "resource_links",
          "instructor_note"
        ])
      );
    }
  });
});
