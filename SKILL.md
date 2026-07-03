# Lecture Site Engine Skill

Use this skill to convert one raw lecture source into `content/lecture.template.md` using the supported Lecture Site Engine schema.

## Inputs

- Read one raw lecture source.
- For the MVP golden workflow, use `examples/raw-lecture.txt` as the only raw source.
- For a user's own lecture, prefer `content/raw-lecture.txt`.
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
3. Write a valid `lecture.template.md` in each subdirectory using the same schema as the single-lecture workflow.
4. Run `npm run validate` to validate the whole collection.
5. Revise the lectures until every entry passes validation.

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
9. Revise `content/lecture.template.md` until validation passes.
10. Run or tell the user to run `npm run dev` and preview `http://localhost:3000`.

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

````markdown
```lecture-component
type: code_block
language: "text"
code: "Example code or command"
```
````

Do not use unsupported component types such as `comparison`, `summary`, `quote`, or `quiz`.

## Validation Checklist Before Finishing

- Frontmatter has non-empty `title`, `description`, `audience`, `duration`, and `level`.
- Headings use the exact required names and order.
- Learning objectives and key takeaways are Markdown bullet lists.
- Every section title is non-empty.
- Every section has meaningful content.
- Component YAML uses only supported types and required fields.
- `npm run validate` passes without errors.
