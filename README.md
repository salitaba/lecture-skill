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

## Files

- `content/lecture.template.md`: the fallback single-lecture render input.
- `lectures/`: local multi-lecture workspace for collection mode; keep it out of git if you want private course content.
- `content/raw-lecture.txt`: recommended working path for your own raw lecture notes.
- `examples/raw-lecture.txt`: golden raw source for MVP evaluation.
- `examples/golden.template.md`: reviewer reference for the golden workflow.
- `examples/component-demo.template.md`: valid demo of all supported MVP components.
- `examples/multi-lecture/`: example collection scaffold for multi-lecture mode.
- `docs/mvp-review-checklist.md`: human pass/fail review checklist.
- `docs/golden-conversion-batch.md`: launch-decision record for the three-run golden conversion batch.

## Multi-Lecture Collections

The engine supports a lightweight collection mode when a root-level `lectures/` directory exists with one or more numbered lecture subdirectories.

```text
lectures/
  01-introduction/
    lecture.template.md
  02-core-concepts/
    lecture.template.md
```

In collection mode:

- The root page renders a collection landing page instead of the single lecture preview.
- Each lecture is available at `/lectures/<slug>`, where `<slug>` is the numbered subdirectory name.
- Each lecture page includes previous/next navigation and a back-to-course link.
- `npm run validate` validates every `lectures/*/lecture.template.md` file and reports per-lecture status.

Collection mode takes precedence over `content/lecture.template.md` whenever `lectures/` exists. If `lectures/` is absent or empty, the app falls back to the single-lecture workflow and continues to render `content/lecture.template.md` exactly as before.

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
6. Run `npm run dev` and preview `http://localhost:3000`.
7. Review the result with `docs/mvp-review-checklist.md`.

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
