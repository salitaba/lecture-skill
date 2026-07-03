# Lecture Site Engine

Lecture Site Engine turns one structured lecture template into a local, visual lecture page. It is designed for technical educators working with Node.js, npm, and an AI coding agent such as Codex.

## Requirements

- Node.js 24 LTS
- The npm version bundled with Node.js 24 LTS

## Setup

Install dependencies:

```bash
npm install
```

Validate the active lecture or collection:

```bash
npm run validate
```

Preview locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

Create a portable static review package when you are ready to hand off a validated lecture or collection:

```bash
npm run package:review
```

The package command is an explicit handoff step, not part of the normal edit loop.

Create a source fidelity worksheet for human review:

```bash
npm run review:source
```

The worksheet command runs validation, records the result, and still writes a worksheet when validation fails.

## Files

- `content/lecture.template.md`: the fallback single-lecture render input.
- `content/raw-lecture.txt`: recommended raw source evidence for the single-lecture workflow.
- `lectures/`: local multi-lecture workspace for collection mode; keep it out of git if you want private course content.
- `examples/raw-lecture.txt`: golden raw source for MVP evaluation.
- `examples/golden.template.md`: reviewer reference for the golden workflow.
- `examples/component-demo.template.md`: valid demo of all supported MVP components.
- `examples/multi-lecture/`: example collection scaffold for multi-lecture mode.
- `docs/mvp-review-checklist.md`: human pass/fail review checklist.
- `docs/golden-conversion-batch.md`: launch-decision record for the three-run golden conversion batch.
- `review-packages/`: generated static review packages, ignored by git.

## Multi-Lecture Collections

The engine supports a lightweight collection mode when a root-level `lectures/` directory exists with one or more numbered lecture subdirectories.

```text
lectures/
  raw-course.txt
  01-introduction/
    raw-lecture.txt
    lecture.template.md
  02-core-concepts/
    raw-lecture.txt
    lecture.template.md
```

In collection mode:

- The root page renders a collection landing page instead of the single lecture preview.
- Each lecture is available at `/lectures/<slug>`, where `<slug>` is the numbered subdirectory name.
- Each lecture page includes previous/next navigation and a back-to-course link.
- `npm run validate` validates every `lectures/*/lecture.template.md` file and reports per-lecture status.

Collection mode takes precedence over `content/lecture.template.md` whenever `lectures/` exists. If `lectures/` is absent or empty, the app falls back to the single-lecture workflow and continues to render `content/lecture.template.md` exactly as before.

## Source Fidelity Review

Source fidelity review is a human review workflow. It does not perform semantic fact-checking, call an LLM, score source coverage, or block schema validation. It creates an auditable worksheet that ties raw source evidence to generated templates, rendered routes, validation results, reviewer fields, and source-fidelity checklist items.

Use these raw source conventions:

- Single lecture: keep the source in `content/raw-lecture.txt` and the generated template in `content/lecture.template.md`.
- Collection with per-lecture sources: keep each source in `lectures/<slug>/raw-lecture.txt` next to `lectures/<slug>/lecture.template.md`.
- Collection split from one shared source: keep the shared source in `lectures/raw-course.txt`.
- When both per-lecture and shared collection sources exist, the per-lecture source is primary and `lectures/raw-course.txt` is additional context.

Generate a worksheet:

```bash
npm run review:source
```

The command writes `docs/review-worksheets/<timestamp>-source-fidelity-review.md`, prints the worksheet path, validation status, lecture count, and missing raw source evidence. It exits `0` when the worksheet is created, even if validation failed, because the failed validation state is useful review evidence. Missing raw source files are warnings, not command failures.

Example workflows:

1. Single-source workflow: save the raw lecture in `content/raw-lecture.txt`, generate `content/lecture.template.md`, run `npm run validate`, then run `npm run review:source`.
2. Per-lecture collection workflow: create `lectures/01-introduction/raw-lecture.txt` and `lectures/01-introduction/lecture.template.md` for each lecture, run `npm run validate`, then run `npm run review:source`.
3. Shared-source collection workflow: save the original course notes in `lectures/raw-course.txt`, generate each `lectures/<slug>/lecture.template.md`, optionally add per-lecture raw sources for tighter review, then run `npm run review:source`.

## Static Review Packages

Run `npm run package:review` after `npm run validate` passes and you want to send the rendered lecture experience to a reviewer.

The command:

- Detects single-lecture mode or collection mode using the same rules as the app.
- Validates first and exits nonzero if the active single lecture or any collection lecture is invalid.
- Builds a static export and writes a timestamped folder under `review-packages/<timestamp>-lecture-site/`.
- Copies rendered HTML/assets, active source templates, available raw source evidence, `manifest.json`, `MANIFEST.md`, package `README.md`, `REVIEW_WORKSHEET.md`, and `REVIEW_CHECKLIST.md`.

In single-lecture mode, the active source is `content/lecture.template.md` and it is copied to `source/content/lecture.template.md` inside the package.

In single-lecture mode, `content/raw-lecture.txt` is copied to `source/content/raw-lecture.txt` when it exists. In collection mode, only active `lectures/<slug>/lecture.template.md` files are copied under `source/lectures/<slug>/lecture.template.md`; matching `lectures/<slug>/raw-lecture.txt` files and `lectures/raw-course.txt` are copied when present. The inactive `content/lecture.template.md` file is not copied as an active source.

Missing raw source evidence does not block package creation. The package command prints missing-source warnings, `manifest.json` and `MANIFEST.md` record present/missing raw source status, and package-local `REVIEW_WORKSHEET.md` gives reviewers the source fidelity checklist and notes fields.

The generated package is designed to open directly from the filesystem. Send reviewers the generated package folder. Optional zip packaging is not implemented yet.

The command owns Next's generated `out/` directory for the current run. If `out/` already exists before packaging starts, the command stops and asks you to move or remove it rather than overwriting a user-owned export.

## Template Schema

The MVP supports exactly one template schema: YAML frontmatter plus Markdown body sections.

Required frontmatter fields:

```yaml
---
title: "Lecture title"
description: "Short lecture summary"
audience: "Intended learner group"
duration: "45 minutes"
level: "beginner"
---
```

`level` must be `beginner`, `intermediate`, or `advanced`.

Required body sections must appear in this order:

```markdown
## Overview

## Learning Objectives

## Section: First Section Title

## Key Takeaways
```

There must be one or more `## Section: <section title>` blocks. Each section needs meaningful content: a paragraph, list, regular fenced code block, Markdown table, or supported lecture component.

## Supported Components

Components are authored as fenced YAML blocks with the language tag `lecture-component`.

Callout:

````markdown
```lecture-component
type: callout
variant: insight
title: "Important idea"
body: "Highlighted explanation."
```
````

`variant` must be `note`, `warning`, or `insight`.

Concept card:

````markdown
```lecture-component
type: concept_card
title: "Core term"
body: "Compact explanation of one concept."
```
````

Step list:

````markdown
```lecture-component
type: step_list
title: "Workflow"
steps:
  - "First step"
  - "Second step"
```
````

Code block:

````markdown
```lecture-component
type: code_block
language: "bash"
code: "npm run validate"
```
````

Deferred component types such as `comparison`, `summary`, `quote`, and `quiz` are not supported in MVP and will fail validation.

## Complete Synthetic Template

This example is generic and is not derived from the golden lecture source.

````markdown
---
title: "Planning A Small Refactor"
description: "A short lecture about preparing a low-risk code refactor."
audience: "Junior software engineers"
duration: "30 minutes"
level: "beginner"
---

## Overview

This lecture explains how to define a small refactor, protect behavior with tests, and make changes in reviewable steps.

## Learning Objectives

- Identify the behavior that must stay unchanged during a refactor.
- Split a refactor into small reviewable steps.
- Use validation commands to confirm the refactor is safe.

## Section: Define The Boundary

Start by naming the code path, behavior, and files that are in scope. Write down what should not change.

```lecture-component
type: callout
variant: note
title: "Keep scope visible"
body: "A refactor is easier to review when the intended behavior is written down before editing."
```

## Section: Make The Smallest Useful Change

Change one layer or one behavior-preserving structure at a time. Run focused checks after each step.

```lecture-component
type: step_list
title: "Refactor loop"
steps:
  - "Name the behavior that must remain unchanged."
  - "Make one small structural change."
  - "Run the focused verification command."
  - "Commit or continue only when the check passes."
```

## Key Takeaways

- Good refactors preserve behavior while improving structure.
- Small steps make review and rollback easier.
- Validation commands are part of the refactor, not an afterthought.
````

## Creating A New Lecture With An AI Agent

1. Put one raw lecture source in `content/raw-lecture.txt`.
2. Ask the AI agent to follow `SKILL.md`.
3. The agent should create or update `content/lecture.template.md`.
4. Run `npm run validate`.
5. Fix validation errors until the command passes.
6. Run `npm run review:source` and complete the generated source fidelity worksheet.
7. Run `npm run dev` and preview `http://localhost:3000`.
8. Review the result with `docs/mvp-review-checklist.md`.
9. When a handoff artifact is requested, run `npm run package:review` and send the generated `review-packages/<timestamp>-lecture-site/` folder to reviewers.

For the golden MVP workflow, use `examples/raw-lecture.txt` as the only raw source. Before giving the prompt to the agent, make `examples/golden.template.md` inaccessible and remove or replace `content/lecture.template.md` with a minimal non-golden placeholder if it contains the shipping demo answer. The agent-accessible workspace must not expose the golden answer until after generation and validation are complete. Record the batch in `docs/golden-conversion-batch.md`.

## Common Validation Errors

- Missing frontmatter field: add the named field between the `---` lines.
- Invalid `level`: use `beginner`, `intermediate`, or `advanced`.
- Missing required section: add the exact heading named in the error.
- Out-of-order heading: use Overview, Learning Objectives, Section blocks, then Key Takeaways.
- Component outside section: move the fenced block inside a `## Section: <title>` block.
- Unsupported component type: use only `callout`, `concept_card`, `step_list`, or `code_block`.
- Malformed YAML: check indentation, quotes, and key/value syntax.
- Empty list: add at least one bullet item or step.

## Previewing The Component Demo

To preview all supported components, preserve your active template first, then copy the demo:

```bash
cp content/lecture.template.md /tmp/lecture.template.backup.md
cp examples/component-demo.template.md content/lecture.template.md
npm run validate
npm run dev
```

This replaces the active render template. Restore your lecture afterward:

```bash
cp /tmp/lecture.template.backup.md content/lecture.template.md
```

If you want to restore the shipping demo lecture, copy `examples/golden.template.md` to `content/lecture.template.md`.
