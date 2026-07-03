import { describe, expect, it } from "vitest";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { errorCodes, fixture, validationErrors } from "./testUtils";

describe("validateTemplateSource", () => {
  it("accepts the active valid template", () => {
    const result = validateTemplateSource(fixture("content/lecture.template.md"));

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.template.metadata.level).toBe("beginner");
      expect(result.template.sections).toHaveLength(4);
      expect(new Set(result.template.sections.map((section) => section.anchor)).size).toBe(result.template.sections.length);
      expect(result.template.sections.every((section) => section.anchor.length > 0)).toBe(true);
    }
  });

  it("accepts the component demo fixture", () => {
    expect(validateTemplateSource(fixture("examples/component-demo.template.md")).valid).toBe(true);
  });

  it("reports missing and empty frontmatter fields", () => {
    expect(errorCodes("examples/invalid/missing-frontmatter-title.template.md")).toContain("REQUIRED_FRONTMATTER_FIELD");
    expect(errorCodes("examples/invalid/empty-frontmatter-field.template.md")).toContain("REQUIRED_FRONTMATTER_FIELD");
  });

  it("reports invalid level with allowed values hint", () => {
    const errors = validationErrors("examples/invalid/invalid-level.template.md");

    expect(errors.map((error) => error.code)).toContain("INVALID_LEVEL");
    expect(errors.find((error) => error.code === "INVALID_LEVEL")?.hint).toContain("beginner");
  });

  it("reports required heading problems", () => {
    expect(errorCodes("examples/invalid/missing-required-sections.template.md")).toContain("MISSING_REQUIRED_SECTION");
    expect(errorCodes("examples/invalid/out-of-order-headings.template.md")).toContain("OUT_OF_ORDER_HEADINGS");
    expect(errorCodes("examples/invalid/duplicate-singleton-heading.template.md")).toContain("DUPLICATE_REQUIRED_HEADING");
  });

  it("reports invalid body structure", () => {
    expect(errorCodes("examples/invalid/content-before-overview.template.md")).toContain("CONTENT_BEFORE_OVERVIEW");
    expect(errorCodes("examples/invalid/empty-overview.template.md")).toContain("EMPTY_OVERVIEW");
    expect(errorCodes("examples/invalid/empty-learning-objectives.template.md")).toContain("EMPTY_LEARNING_OBJECTIVES");
    expect(errorCodes("examples/invalid/empty-key-takeaways.template.md")).toContain("EMPTY_KEY_TAKEAWAYS");
    expect(errorCodes("examples/invalid/empty-section-title.template.md")).toContain("EMPTY_SECTION_TITLE");
    expect(errorCodes("examples/invalid/section-without-meaningful-content.template.md")).toContain("SECTION_WITHOUT_MEANINGFUL_CONTENT");
  });

  it("reports component placement, support, and payload problems with context", () => {
    expect(errorCodes("examples/invalid/component-outside-section.template.md")).toContain("COMPONENT_OUTSIDE_SECTION");
    expect(errorCodes("examples/invalid/unsupported-component-type.template.md")).toContain("UNSUPPORTED_COMPONENT_TYPE");
    expect(errorCodes("examples/invalid/invalid-callout-variant.template.md")).toContain("INVALID_COMPONENT_FIELD");
    expect(errorCodes("examples/invalid/missing-component-field.template.md")).toContain("INVALID_COMPONENT_FIELD");
    expect(errorCodes("examples/invalid/empty-step-list-steps.template.md")).toContain("INVALID_COMPONENT_FIELD");

    const unsupported = validationErrors("examples/invalid/unsupported-component-type.template.md").find(
      (error) => error.code === "UNSUPPORTED_COMPONENT_TYPE"
    );
    expect(unsupported?.componentType).toBe("quiz");
    expect(unsupported?.sectionTitle).toBe("Valid Section");
  });

  it("reports syntax-breaking YAML and fence errors", () => {
    expect(errorCodes("examples/invalid/invalid-frontmatter-yaml.template.md")).toContain("INVALID_FRONTMATTER_YAML");
    expect(errorCodes("examples/invalid/malformed-component-yaml.template.md")).toContain("MALFORMED_COMPONENT_YAML");
    expect(errorCodes("examples/invalid/unclosed-lecture-component-fence.template.md")).toContain("UNCLOSED_COMPONENT_FENCE");
  });

  it("keeps wrapped objective and takeaway text in the normalized model", () => {
    const result = validateTemplateSource(`---
title: "Wrapped"
description: "Wrapped list item"
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Explain how wrapped
  objective text remains complete.

## Section: One

Section content.

## Key Takeaways

- Remember that wrapped
  takeaway text remains complete.
`);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.template.objectives).toEqual(["Explain how wrapped objective text remains complete."]);
      expect(result.template.takeaways).toEqual(["Remember that wrapped takeaway text remains complete."]);
    }
  });
});
