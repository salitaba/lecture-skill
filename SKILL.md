# Lecture Site Engine Skill

Use this skill to convert one raw lecture source into `content/lecture.template.md` using the supported Lecture Site Engine schema.

## Inputs

- Read one raw lecture source.
- For the MVP golden workflow, use `examples/raw-lecture.txt` as the only raw source.
- For a user's own lecture, prefer `content/raw-lecture.txt`.
- Preserve raw source files as review evidence. Never overwrite a raw source file with generated lecture prose.
- Do not read `examples/golden.template.md` while generating the golden template.

## Output

Create or update exactly:

```text
content/lecture.template.md
```

Use YAML frontmatter plus the required Markdown headings:

```markdown
---
title: "Lecture title"
description: "Short lecture summary"
audience: "Intended learner group"
duration: "45 minutes"
level: "beginner"
---

## Overview

## Learning Objectives

## Section: Section Title

## Key Takeaways
```

`level` must be `beginner`, `intermediate`, or `advanced`.

When starting new work, prefer the local scaffold commands over hand-creating paths:

- Run `npm run new:collection` for a new multi-lecture course workspace.
- Run `npm run new:lecture` to create the next lecture in the active workflow.
- Do not overwrite raw source files or existing templates unless the user explicitly asks.

## Multi-Lecture Collection Workflow

When the repository contains a `lectures/` directory, treat it as a collection of lecture templates instead of a single active lecture. Use numbered subdirectories so authored order stays obvious:

```text
lectures/
  01-introduction/
    lecture.template.md
  02-core-concepts/
    lecture.template.md
```

For a collection:

1. Read the course outline or multi-lecture source.
2. Add `lectures/course.yaml` when the course title and description are known. This file is optional and separate from lecture frontmatter.
3. Create one numbered subdirectory per lecture under `lectures/`, preferably with `npm run new:lecture`.
4. Preserve source evidence as `lectures/<slug>/raw-lecture.txt` for each lecture when per-lecture source is available.
5. Preserve a shared source as `lectures/raw-course.txt` when one course source is split into multiple lectures.
6. Write a valid `lecture.template.md` in each subdirectory using the same schema as the single-lecture workflow.
7. Run `npm run validate` or `npm run validate -- --json` to validate the whole collection.
8. Revise the lectures until every entry and course metadata passes validation.

Use `examples/multi-lecture/` as a reference collection scaffold. Keep the single-lecture workflow above intact for repos that do not have `lectures/`.

`lectures/course.yaml` supports these P0 fields:

```yaml
title: "Course title"
description: "Short course description."
audience: "Technical learners"
level: "beginner"
duration: "3 hours"
```

`title` and `description` are required when the file exists. `audience`, `level`, and `duration` are optional; `level` must be `beginner`, `intermediate`, or `advanced`.

## Conversion Process

1. Read the raw lecture source completely.
2. Identify the lecture title, intended audience, likely level, duration, learning objectives, major sections, examples, caveats, practical steps, and takeaways.
3. Preserve source-grounded meaning. Reorganize and clarify, but do not add unsupported facts, statistics, tools, external references, or promises.
4. If the source is incomplete or uncertain, preserve that uncertainty in neutral wording.
5. Create 3-6 coherent ordered sections unless the source is clearly shorter.
6. Use visual components only when they improve comprehension.
7. Keep every component inside a `## Section: <section title>` block.
8. Run `npm run validate`. Use `npm run validate -- --json` when revising from machine-readable feedback.
9. Revise `content/lecture.template.md` or collection templates until validation passes.
10. Run `npm run review:source` before approval review so the reviewer has source paths, validation status, rendered routes, and checklist fields.
11. Run `npm run doctor` before preview, source-review, or package handoff.
12. Run or tell the user to run `npm run dev` and preview `http://localhost:3000`.

## Source Fidelity Review

Raw sources are review evidence, not learner-facing render inputs.

- Single lecture raw source: `content/raw-lecture.txt`.
- Single lecture generated template: `content/lecture.template.md`.
- Collection per-lecture raw source: `lectures/<slug>/raw-lecture.txt`.
- Collection shared raw source: `lectures/raw-course.txt`.
- When both per-lecture and shared sources exist, treat per-lecture source as primary and shared source as additional context.

Run `npm run review:source` after validation work. The command creates `docs/review-worksheets/<timestamp>-source-fidelity-review.md` even when validation fails, because invalid state is useful review evidence. Missing raw source files should be reported, but they are not schema validation failures.

## Review Package Handoff

Create a static review package only when the user asks for a handoff artifact or the workflow explicitly calls for one. Do not export automatically after every lecture generation.

1. Create or update the single lecture template or collection templates.
2. Run `npm run validate`.
3. Revise templates until validation passes.
4. Run `npm run review:source` if the reviewer needs source fidelity evidence before handoff.
5. Run `npm run package:review`.
6. Report the generated `review-packages/<timestamp>-lecture-site/` path.

Packaging validates before export. Invalid single lectures or invalid collection lectures must be fixed before a completed package is created.
Use `npm run package:review` only for portable handoff artifacts. The package includes `REVIEW_WORKSHEET.md` and any raw source files present at the expected evidence paths.
Valid `lectures/course.yaml` metadata is copied into collection packages and appears in `manifest.json`, `MANIFEST.md`, and package-local worksheets. Invalid course metadata blocks package creation.

## Supported Components

Use only these component types.

````markdown
```lecture-component
type: callout
variant: note
title: "Title"
body: "Body text."
```
````

`callout.variant` must be `note`, `warning`, or `insight`.

````markdown
```lecture-component
type: concept_card
title: "Concept"
body: "Explanation."
```
````

````markdown
```lecture-component
type: step_list
title: "Process"
steps:
  - "First step"
  - "Second step"
```
````

The authored type is `step_list`, but the rendered label is `Step-by-step`. Use it only for ordered workflows.

````markdown
```lecture-component
type: code_block
language: "text"
code: "Example code or command"
```
````

Rendered label: `Code example`. Use code blocks for commands, snippets, and short structured text.

````markdown
```lecture-component
type: comparison
title: "Local State vs Shared State"
left_label: "Local state"
right_label: "Shared state"
items:
  - label: "Ownership"
    left: "Owned by one component."
    right: "Shared across several components."
```
````

Rendered label: `Comparison`. Use `comparison` only for clear two-sided contrasts. `left_label` and `right_label` are optional.

````markdown
```lecture-component
type: summary
title: "What to remember"
items:
  - "First recap point."
  - "Second recap point."
```
````

Rendered label: `Section summary`. Use `summary` for a local section recap before moving on, not as a replacement for final key takeaways.

````markdown
```lecture-component
type: quote
quote: "Short source-grounded excerpt or named statement."
attribution: "Original notes"
context: "Why this quote matters here."
```
````

Rendered label: `Source quote`. Use `quote` only for short source-grounded excerpts or named statements. Do not invent quotes or include long passages.

````markdown
```lecture-component
type: quiz
question: "Which command validates the active lecture or collection?"
options:
  - "npm run validate"
  - "npm run dev"
answer: "npm run validate"
explanation: "Validation checks the active template or collection."
```
````

Rendered label: `Quiz: Knowledge check`. Use `quiz` for lightweight knowledge checks with feedback revealed on demand. The schema is unchanged: `question`, `options`, `answer`, and optional `explanation`; the `answer` must exactly match one option after trimming whitespace. Interactive pages initially show the question, options, and a `Show answer` button, then toggle to `Hide answer` after reveal. Printed output includes the answer and explanation by default. If JavaScript is unavailable, the rendered quiz shows a `<noscript>` message explaining that interactive reveal requires JavaScript and that printed output includes the answer and explanation. Quiz reveal is a pacing aid, not secure assessment, grading, learner tracking, answer encryption, anti-cheating, learner accounts, analytics, or source-code secrecy.

````markdown
```lecture-component
type: question_set
title: "Check Your Understanding"
instructions: "Answer before revealing feedback."
shuffle_options: true
questions:
  - question: "What validates the active lecture or collection?"
    options:
      - "npm run validate"
      - "npm run dev"
    answer: "npm run validate"
    feedback: "Validation catches schema and structure errors."
  - question: "What does authored order support?"
    options:
      - "Stable print and review output."
      - "Learner analytics."
    answer: "Stable print and review output."
```
````

Rendered label: `Assessment: Question set`. Use `question_set` for several related single-answer checks. It requires non-empty `title` and at least two questions. Each question requires non-empty `question`, at least two non-empty `options`, and an `answer` that exactly matches one option after trimming. Optional `feedback` reveals per question. `shuffle_options` is preview-only and must not be described as secure randomization; authored order remains in source, static output, print, and review packages. Multiple-answer question sets are not supported in P0.

````markdown
```lecture-component
type: free_response
title: "Explain The Tradeoff"
prompt: "Why compare your answer after drafting it?"
placeholder: "Draft your response here..."
guidance: "Committing to an answer first makes the comparison more useful."
```
````

Rendered label: `Assessment: Free response`. Use `free_response` for written reasoning, predictions, reflections, or design explanations. It requires non-empty `title` and `prompt`; `guidance` and `placeholder` are optional. Learner input is local-only browser state and is not saved, submitted, graded, tracked, or packaged as learner state.

````markdown
```lecture-component
type: practice_task
title: "Repair An Invalid Assessment"
scenario: "A generated lecture has a mismatched question_set answer."
task: "Use validation output to locate and fix the invalid YAML."
steps:
  - "Run npm run validate."
  - "Inspect the reported field path."
hints:
  - "Start at questions[index].answer."
starter_code:
  language: "yaml"
  code: "type: question_set"
solution: "Make answer exactly match one authored option."
rubric:
  - criterion: "Validation"
    expected: "The lecture validates without field errors."
```
````

Rendered label: `Practice task`. Use `practice_task` for applied work: coding, debugging, architecture, process, or self-evaluation tasks. It requires non-empty `title` and `task`; optional fields are `scenario`, `steps`, `hints`, `starter_code`, `solution`, and `rubric`. Rubrics are visible by default. Hints and solutions use reveal controls on screen and are visible in print.

For all assessment components, hidden answers, guidance, hints, and solutions are pacing aids only. They remain present in source templates, static HTML, print output, and review packages. Do not promise secure exams, runtime grading, learner analytics, persistence, uploads, AI feedback at runtime, or unsupported component types.

````markdown
```lecture-component
type: diagram
diagram_type: flowchart
title: "Data flow overview"
code: "graph LR\n  A[Input] --> B[Process]\n  B --> C[Output]"
direction: LR
theme: default
```
````

Rendered label: `Diagram`. Use `diagram` for visual representations of architecture, process flows, sequence interactions, state machines, data models, and timelines using Mermaid.js syntax. Required fields: `diagram_type`, `title`, and `code`. Supported `diagram_type` values: `flowchart`, `sequence`, `class`, `state`, `er`, `gantt`, `pie`, `mindmap`. Optional fields: `direction` (flowchart only: `TB`, `LR`, `BT`, `RL`) and `theme` (`default`, `dark`, `forest`, `neutral`, `base`). The `code` field contains valid Mermaid.js diagram source. On the client, Mermaid.js renders the diagram as SVG; without JavaScript, the raw source code is shown as a fallback. Use diagrams when visual representations clarify architecture, processes, interactions, or data relationships. Do not use diagrams for simple lists, short text comparisons, single-step processes, or content better suited to code blocks or step lists.

Do not invent custom component types. Unsupported component types fail validation.

## Validation Checklist Before Finishing

- Frontmatter has non-empty `title`, `description`, `audience`, `duration`, and `level`.
- Headings use the exact required names and order.
- Learning objectives and key takeaways are Markdown bullet lists.
- Every section title is non-empty.
- Every section has meaningful content.
- Component YAML uses only supported types and required fields.
- `npm run validate` passes without errors.
- `npm run doctor` reports the project is ready for the intended next step.
