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
2. Create one numbered subdirectory per lecture under `lectures/`.
3. Preserve source evidence as `lectures/<slug>/raw-lecture.txt` for each lecture when per-lecture source is available.
4. Preserve a shared source as `lectures/raw-course.txt` when one course source is split into multiple lectures.
5. Write a valid `lecture.template.md` in each subdirectory using the same schema as the single-lecture workflow.
6. Run `npm run validate` to validate the whole collection.
7. Revise the lectures until every entry passes validation.

Use `examples/multi-lecture/` as a reference collection scaffold. Keep the single-lecture workflow above intact for repos that do not have `lectures/`.

## Conversion Process

1. Read the raw lecture source completely.
2. Identify the lecture title, intended audience, likely level, duration, learning objectives, major sections, examples, caveats, practical steps, and takeaways.
3. Preserve source-grounded meaning. Reorganize and clarify, but do not add unsupported facts, statistics, tools, external references, or promises.
4. If the source is incomplete or uncertain, preserve that uncertainty in neutral wording.
5. Create 3-6 coherent ordered sections unless the source is clearly shorter.
6. Use visual components only when they improve comprehension.
7. Keep every component inside a `## Section: <section title>` block.
8. Run `npm run validate`.
9. Revise `content/lecture.template.md` or collection templates until validation passes.
10. Run `npm run review:source` before approval review so the reviewer has source paths, validation status, rendered routes, and checklist fields.
11. Run or tell the user to run `npm run dev` and preview `http://localhost:3000`.

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

Rendered label: `Quiz: Knowledge check`. Use `quiz` for static teaching checks that should be visibly recognizable as quizzes. Quizzes render a visible static answer key; they are not secure assessment, grading, learner tracking, hidden-answer tests, learner accounts, or analytics. The `answer` must exactly match one option after trimming whitespace.

Do not invent custom component types. Unsupported component types fail validation.

## Validation Checklist Before Finishing

- Frontmatter has non-empty `title`, `description`, `audience`, `duration`, and `level`.
- Headings use the exact required names and order.
- Learning objectives and key takeaways are Markdown bullet lists.
- Every section title is non-empty.
- Every section has meaningful content.
- Component YAML uses only supported types and required fields.
- `npm run validate` passes without errors.
