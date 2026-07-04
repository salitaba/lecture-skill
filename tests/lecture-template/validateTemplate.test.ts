import { describe, expect, it } from "vitest";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { errorCodes, fixture, validationErrors } from "./testUtils";

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

  it("keeps the component demo as an exact all-components gallery", () => {
    const result = validateTemplateSource(fixture("examples/component-demo.template.md"));

    expect(result.valid).toBe(true);
    if (result.valid) {
      const componentTypes = result.template.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component.type] : []))
      );

      expect(new Set(componentTypes)).toEqual(new Set(supportedComponentTypes));
      for (const componentType of supportedComponentTypes) {
        expect(componentTypes).toContain(componentType);
      }
    }
  });

  it("normalizes learning components with defaults, trimmed strings, and preserved order", () => {
    const result = validateTemplateSource(validLearningComponentsTemplate());

    expect(result.valid).toBe(true);
    if (result.valid) {
      const components = result.template.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component] : []))
      );

      expect(components).toContainEqual({
        type: "comparison",
        title: "Default labels",
        leftLabel: "Option A",
        rightLabel: "Option B",
        items: [
          { label: "Ownership", left: "Owned locally", right: "Shared broadly" },
          { label: "Timing", left: "Before review", right: "After validation" }
        ]
      });
      expect(components).toContainEqual({
        type: "comparison",
        title: "Custom labels",
        leftLabel: "Local",
        rightLabel: "Shared",
        items: [{ label: "Scope", left: "One component", right: "Many components" }]
      });
      expect(components).toContainEqual({
        type: "summary",
        title: "Remember",
        items: ["Trimmed first", "Trimmed second"]
      });
      expect(components).toContainEqual({
        type: "quote",
        quote: "Short source-grounded statement.",
        attribution: "Lecture notes",
        context: "Introduce the tradeoff."
      });
      expect(components).toContainEqual({
        type: "quote",
        quote: "A quote can omit attribution and context."
      });
      expect(components).toContainEqual({
        type: "quiz",
        anchor: "learning-models-quiz-which-option-is-correct",
        question: "Which option is correct?",
        options: ["First", "Second"],
        answer: "First",
        explanation: "The answer matches a trimmed option."
      });
    }
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
    expect(unsupported?.componentType).toBe("flashcard");
    expect(unsupported?.sectionTitle).toBe("Valid Section");
    expect(unsupported?.hint).toContain("comparison");
    expect(unsupported?.hint).toContain("quiz");
  });

  it("reports learning component field paths with component, section, locator, and hints", () => {
    const result = validateTemplateSource(invalidLearningComponentsTemplate());

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const byField = new Map(result.errors.filter((error) => error.code === "INVALID_COMPONENT_FIELD").map((error) => [error.field, error]));

      for (const field of ["items", "items[0].label", "items[0].left", "items[0].right", "options", "options[0]", "answer"]) {
        expect(byField.has(field), field).toBe(true);
        const error = byField.get(field);
        expect(error?.sectionTitle).toBe("Learning Problems");
        expect(error?.componentType).toMatch(/comparison|quiz/);
        expect(error?.locator?.line).toBeGreaterThan(0);
        expect(error?.hint).toBeTruthy();
      }

      expect(byField.get("items[0].label")?.componentType).toBe("comparison");
      expect(byField.get("options[0]")?.componentType).toBe("quiz");
      expect(byField.get("answer")?.componentType).toBe("quiz");
    }
  });

  it("keeps lecture components outside section blocks invalid for new component types", () => {
    const result = validateTemplateSource(`---
title: "Outside Components"
description: "Components are outside sections."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

\`\`\`lecture-component
type: comparison
title: "Outside"
items:
  - label: "A"
    left: "B"
    right: "C"
\`\`\`

\`\`\`lecture-component
type: summary
title: "Outside"
items:
  - "One"
\`\`\`

\`\`\`lecture-component
type: quote
quote: "Outside."
\`\`\`

\`\`\`lecture-component
type: quiz
question: "Outside?"
options:
  - "Yes"
  - "No"
answer: "Yes"
\`\`\`

## Learning Objectives

- Learn placement.

## Section: Valid Section

Section content.

## Key Takeaways

- Keep components inside sections.
`);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const outsideErrors = result.errors.filter((error) => error.code === "COMPONENT_OUTSIDE_SECTION");
      expect(outsideErrors.map((error) => error.componentType)).toEqual(["comparison", "summary", "quote", "quiz"]);
    }
  });

  it("accepts stronger assessment components with trimmed values and stable anchors", () => {
    const result = validateTemplateSource(validAssessmentTemplate());

    expect(result.valid).toBe(true);
    if (result.valid) {
      const components = result.template.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component] : []))
      );
      expect(components).toContainEqual({
        type: "question_set",
        anchor: "assessment-practice-question-set-section-check",
        title: "Section Check",
        instructions: "Answer before reveal.",
        shuffle_options: true,
        questions: [
          {
            question: "What validates templates?",
            options: ["npm run validate", "npm run dev"],
            answer: "npm run validate",
            feedback: "Validation reports schema problems."
          },
          {
            question: "What should answer match?",
            options: ["A trimmed option", "Any synonym"],
            answer: "A trimmed option"
          }
        ]
      });
      expect(components).toContainEqual({
        type: "free_response",
        anchor: "assessment-practice-free-response-explain-the-tradeoff",
        title: "Explain the tradeoff",
        prompt: "Why reveal guidance later?",
        guidance: "Delayed reveal supports retrieval practice.",
        placeholder: "Write a short answer."
      });
      expect(components).toContainEqual({
        type: "practice_task",
        anchor: "assessment-practice-practice-task-debug-the-template",
        title: "Debug the template",
        scenario: "A generated lecture fails validation.",
        task: "Find and fix the invalid assessment.",
        steps: ["Run validation", "Inspect field paths"],
        hints: ["Start with the first INVALID_COMPONENT_FIELD."],
        starter_code: { language: "yaml", code: "type: question_set" },
        solution: "Fix the empty option and mismatched answer.",
        rubric: [{ criterion: "Validation", expected: "All errors are resolved." }]
      });
    }
  });

  it("reports stronger assessment nested field paths with context", () => {
    const result = validateTemplateSource(invalidAssessmentTemplate());

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const byField = new Map(result.errors.filter((error) => error.code === "INVALID_COMPONENT_FIELD").map((error) => [error.field, error]));
      for (const field of [
        "questions[0].question",
        "questions[0].mode",
        "questions[0].options[1]",
        "questions[0].answer",
        "questions[2].options",
        "shuffle_options",
        "guidance",
        "starter_code.language",
        "rubric[0].expected"
      ]) {
        expect(byField.has(field), field).toBe(true);
        expect(byField.get(field)?.sectionTitle).toBe("Assessment Problems");
        expect(byField.get(field)?.locator?.line).toBeGreaterThan(0);
      }
      expect(byField.get("questions[0].options[1]")?.componentType).toBe("question_set");
      expect(byField.get("guidance")?.componentType).toBe("free_response");
      expect(byField.get("rubric[0].expected")?.componentType).toBe("practice_task");
    }
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

  it("accepts valid diagram components for all supported types", () => {
    const types = ["flowchart", "sequence", "class", "state", "er", "gantt", "pie", "mindmap"];
    for (const diagramType of types) {
      const result = validateTemplateSource(diagramTemplate(diagramType));
      expect(result.valid, `diagram_type ${diagramType} should be valid`).toBe(true);
    }
  });

  it("normalizes diagram components with optional fields", () => {
    const result = validateTemplateSource(diagramTemplateWithOptionals());
    expect(result.valid).toBe(true);
    if (result.valid) {
      const components = result.template.sections.flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === "component" ? [block.component] : []))
      );
      expect(components).toContainEqual({
        type: "diagram",
        diagram_type: "flowchart",
        title: "Flow",
        code: "graph LR\n  A --> B",
        direction: "LR",
        theme: "dark"
      });
      expect(components).toContainEqual({
        type: "diagram",
        diagram_type: "sequence",
        title: "Sequence",
        code: "sequenceDiagram\n  A->>B: msg"
      });
    }
  });

  it("reports missing diagram_type error", () => {
    const result = validateTemplateSource(diagramTemplateMissingField("diagram_type"));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("diagram_type must be one of"))).toBe(true);
    }
  });

  it("reports invalid diagram_type error", () => {
    const result = validateTemplateSource(diagramTemplateWithInvalidField("diagram_type", "invalid_type"));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("diagram_type must be one of"))).toBe(true);
    }
  });

  it("reports missing code error", () => {
    const result = validateTemplateSource(diagramTemplateMissingField("code"));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("diagram component requires a code field") || e.message.includes('is missing required field "code"'))).toBe(true);
    }
  });

  it("reports empty code error", () => {
    const result = validateTemplateSource(diagramTemplateWithInvalidField("code", ""));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("diagram code field must not be empty"))).toBe(true);
    }
  });

  it("reports invalid direction error", () => {
    const result = validateTemplateSource(diagramTemplateWithInvalidField("direction", "XX"));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("direction must be one of: TB, LR, BT, RL"))).toBe(true);
    }
  });

  it("reports direction on non-flowchart error", () => {
    const result = validateTemplateSource(diagramTemplateDirectionOnNonFlowchart());
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("direction field is only valid for flowchart diagram_type"))).toBe(true);
    }
  });

  it("reports invalid theme error", () => {
    const result = validateTemplateSource(diagramTemplateWithInvalidField("theme", "neon"));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.message.includes("theme must be one of: default, dark, forest, neutral, base"))).toBe(true);
    }
  });

  it("keeps diagram components outside section blocks invalid", () => {
    const result = validateTemplateSource(`---
title: "Outside Diagram"
description: "Diagram outside section."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

\`\`\`lecture-component
type: diagram
diagram_type: flowchart
title: "Outside"
code: "graph LR\n  A --> B"
\`\`\`

## Learning Objectives

- Learn placement.

## Section: Valid Section

Section content.

## Key Takeaways

- Keep components inside sections.
`);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      const outsideErrors = result.errors.filter((e) => e.code === "COMPONENT_OUTSIDE_SECTION");
      expect(outsideErrors.some((e) => e.componentType === "diagram")).toBe(true);
    }
  });
});

function validLearningComponentsTemplate(): string {
  return `---
title: "Learning Components"
description: "Valid learning components."
audience: "Engineers"
duration: "30 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn the components.

## Section: Learning Models

\`\`\`lecture-component
type: comparison
title: " Default labels "
items:
  - label: " Ownership "
    left: " Owned locally "
    right: " Shared broadly "
  - label: " Timing "
    left: " Before review "
    right: " After validation "
\`\`\`

\`\`\`lecture-component
type: comparison
title: "Custom labels"
left_label: " Local "
right_label: " Shared "
items:
  - label: "Scope"
    left: "One component"
    right: "Many components"
\`\`\`

\`\`\`lecture-component
type: summary
title: " Remember "
items:
  - " Trimmed first "
  - " Trimmed second "
\`\`\`

\`\`\`lecture-component
type: quote
quote: " Short source-grounded statement. "
attribution: " Lecture notes "
context: " Introduce the tradeoff. "
\`\`\`

\`\`\`lecture-component
type: quote
quote: " A quote can omit attribution and context. "
\`\`\`

\`\`\`lecture-component
type: quiz
question: " Which option is correct? "
options:
  - " First "
  - " Second "
answer: "First"
explanation: " The answer matches a trimmed option. "
\`\`\`

## Key Takeaways

- Learning components validate.
`;
}

function validAssessmentTemplate(): string {
  return `---
title: "Assessments"
description: "Valid assessment components."
audience: "Engineers"
duration: "30 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Practice assessment components.

## Section: Assessment Practice

\`\`\`lecture-component
type: question_set
title: " Section Check "
instructions: " Answer before reveal. "
shuffle_options: true
questions:
  - question: " What validates templates? "
    options:
      - " npm run validate "
      - " npm run dev "
    answer: "npm run validate"
    feedback: " Validation reports schema problems. "
  - question: "What should answer match?"
    options:
      - "A trimmed option"
      - "Any synonym"
    answer: "A trimmed option"
\`\`\`

\`\`\`lecture-component
type: free_response
title: " Explain the tradeoff "
prompt: " Why reveal guidance later? "
guidance: " Delayed reveal supports retrieval practice. "
placeholder: " Write a short answer. "
\`\`\`

\`\`\`lecture-component
type: practice_task
title: " Debug the template "
scenario: " A generated lecture fails validation. "
task: " Find and fix the invalid assessment. "
steps:
  - " Run validation "
  - " Inspect field paths "
hints:
  - " Start with the first INVALID_COMPONENT_FIELD. "
starter_code:
  language: " yaml "
  code: " type: question_set "
solution: " Fix the empty option and mismatched answer. "
rubric:
  - criterion: " Validation "
    expected: " All errors are resolved. "
\`\`\`

## Key Takeaways

- Stronger assessments validate.
`;
}

function invalidAssessmentTemplate(): string {
  return `---
title: "Assessment Problems"
description: "Invalid assessment fields."
audience: "Engineers"
duration: "30 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Practice validation.

## Section: Assessment Problems

\`\`\`lecture-component
type: question_set
title: "Broken"
shuffle_options: sometimes
questions:
  - question: ""
    mode: multiple_answer
    options:
      - "Valid option"
      - ""
    answer: "Missing option"
  - "not a mapping"
  - question: "Duplicate options?"
    options:
      - "Same"
      - "Same"
    answer: "Same"
\`\`\`

\`\`\`lecture-component
type: free_response
title: "Written"
prompt: "Explain."
guidance: ""
\`\`\`

\`\`\`lecture-component
type: practice_task
title: "Practice"
task: "Do the task."
starter_code:
  language: ""
  code: "const value = true;"
rubric:
  - criterion: "Correctness"
    expected: ""
\`\`\`

## Key Takeaways

- Invalid fields fail.
`;
}

function diagramTemplate(diagramType: string): string {
  return `---
title: "Diagram Test"
description: "Diagram component test."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn diagrams.

## Section: Diagrams

\`\`\`lecture-component
type: diagram
diagram_type: ${diagramType}
title: "Test diagram"
code: "graph LR\\n  A --> B"
\`\`\`

## Key Takeaways

- Diagrams validate.
`;
}

function diagramTemplateWithOptionals(): string {
  return `---
title: "Diagram Optionals"
description: "Diagram with optional fields."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn diagrams.

## Section: Diagrams

\`\`\`lecture-component
type: diagram
diagram_type: flowchart
title: "Flow"
code: "graph LR\\n  A --> B"
direction: LR
theme: dark
\`\`\`

\`\`\`lecture-component
type: diagram
diagram_type: sequence
title: "Sequence"
code: "sequenceDiagram\\n  A->>B: msg"
\`\`\`

## Key Takeaways

- Diagrams validate.
`;
}

function diagramTemplateMissingField(field: string): string {
  const codeField = field === "code" ? "" : '"graph LR\\n  A --> B"';
  const diagramTypeField = field === "diagram_type" ? "" : "flowchart";
  return `---
title: "Diagram Missing"
description: "Missing field test."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn diagrams.

## Section: Diagrams

\`\`\`lecture-component
type: diagram
${field === "diagram_type" ? "" : `diagram_type: ${diagramTypeField}`}
title: "Test"
code: ${codeField}
\`\`\`

## Key Takeaways

- Diagrams validate.
`;
}

function diagramTemplateWithInvalidField(field: string, value: string): string {
  const diagramType = field === "diagram_type" ? value : "flowchart";
  const code = field === "code" ? value : "graph LR\\n  A --> B";
  const extraField = field !== "diagram_type" && field !== "code" ? `${field}: "${value}"` : "";
  return `---
title: "Diagram Invalid"
description: "Invalid field test."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn diagrams.

## Section: Diagrams

\`\`\`lecture-component
type: diagram
diagram_type: ${diagramType}
title: "Test"
code: "${code}"
${extraField}
\`\`\`

## Key Takeaways

- Diagrams validate.
`;
}

function diagramTemplateDirectionOnNonFlowchart(): string {
  return `---
title: "Diagram Direction"
description: "Direction on non-flowchart."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn diagrams.

## Section: Diagrams

\`\`\`lecture-component
type: diagram
diagram_type: sequence
title: "Test"
code: "sequenceDiagram\\n  A->>B: msg"
direction: LR
\`\`\`

## Key Takeaways

- Diagrams validate.
`;
}

function invalidLearningComponentsTemplate(): string {
  return `---
title: "Invalid Learning Components"
description: "Invalid learning components."
audience: "Engineers"
duration: "30 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- Learn the errors.

## Section: Learning Problems

\`\`\`lecture-component
type: comparison
title: "Empty items"
items: []
\`\`\`

\`\`\`lecture-component
type: comparison
title: "Bad item"
items:
  - label: ""
    left: ""
    right: ""
\`\`\`

\`\`\`lecture-component
type: quiz
question: "Too few options"
options:
  - "Only"
answer: "Only"
\`\`\`

\`\`\`lecture-component
type: quiz
question: "Bad option and answer"
options:
  - ""
  - "Second"
answer: "Missing"
\`\`\`

\`\`\`lecture-component
type: quiz
question: "Wrong answer"
options:
  - "First"
  - "Second"
answer: "Missing"
\`\`\`

## Key Takeaways

- Invalid learning components fail.
`;
}
