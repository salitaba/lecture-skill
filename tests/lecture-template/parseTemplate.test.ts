import { describe, expect, it } from "vitest";
import { parseLectureTemplate } from "../../src/lib/lecture-template/parseTemplate";
import { fixture } from "./testUtils";

describe("parseLectureTemplate", () => {
  it("parses the active lecture structure with source lines", () => {
    const parsed = parseLectureTemplate(fixture("content/lecture.template.md"));

    expect(typeof parsed.frontmatter.value.title).toBe("string");
    expect(parsed.overview?.locator.line).toBeGreaterThan(1);
    expect(parsed.objectives?.blocks.some((block) => block.kind === "bullet_list")).toBe(true);
    expect(parsed.sections).toHaveLength(4);
    expect(parsed.sections[0].blocks.some((block) => block.kind === "component")).toBe(true);
    expect(parsed.takeaways?.blocks.some((block) => block.kind === "bullet_list")).toBe(true);
  });

  it("captures regular fenced code as normal Markdown content", () => {
    const parsed = parseLectureTemplate(fixture("examples/component-demo.template.md"));
    const codeBlock = parsed.sections.flatMap((section) => section.blocks).find((block) => block.kind === "code_fence");

    expect(codeBlock).toMatchObject({ kind: "code_fence", language: "text" });
  });

  it("reports locators for invalid frontmatter YAML", () => {
    const parsed = parseLectureTemplate(fixture("examples/invalid/invalid-frontmatter-yaml.template.md"));

    expect(parsed.errors.some((error) => error.code === "INVALID_FRONTMATTER_YAML" && error.locator?.line)).toBe(true);
  });

  it("reports locators for malformed component YAML", () => {
    const parsed = parseLectureTemplate(fixture("examples/invalid/malformed-component-yaml.template.md"));

    const error = parsed.errors.find((candidate) => candidate.code === "MALFORMED_COMPONENT_YAML");
    expect(error?.locator?.line).toBeTruthy();
    expect(error?.sectionTitle).toBe("Valid Section");
  });

  it("reports locators for unclosed lecture-component fences", () => {
    const parsed = parseLectureTemplate(fixture("examples/invalid/unclosed-lecture-component-fence.template.md"));

    const error = parsed.errors.find((candidate) => candidate.code === "UNCLOSED_COMPONENT_FENCE");
    expect(error?.locator?.line).toBeTruthy();
    expect(error?.sectionTitle).toBe("Valid Section");
  });

  it("folds indented continuation lines into Markdown list items", () => {
    const parsed = parseLectureTemplate(`---
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

    const objectiveList = parsed.objectives?.blocks.find((block) => block.kind === "bullet_list");
    const takeawayList = parsed.takeaways?.blocks.find((block) => block.kind === "bullet_list");

    expect(objectiveList).toMatchObject({
      items: ["Explain how wrapped objective text remains complete."]
    });
    expect(takeawayList).toMatchObject({
      items: ["Remember that wrapped takeaway text remains complete."]
    });
    expect((objectiveList as { itemLocators?: Array<{ line?: number }> } | undefined)?.itemLocators?.[0]?.line).toBe(15);
  });

  it("retains item locators for explicit objective markers", () => {
    const parsed = parseLectureTemplate(fixture("tests/fixtures/learning-loop/objectives-explicit.template.md"));
    const objectiveList = parsed.objectives?.blocks.find((block) => block.kind === "bullet_list");

    expect((objectiveList as { itemLocators?: Array<{ line?: number }> } | undefined)?.itemLocators).toMatchObject([{ line: 15 }, { line: 16 }]);
  });
});
