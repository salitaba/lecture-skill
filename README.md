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

For machine-readable validation output, use:

```bash
npm run validate -- --json
```

Create a new local collection scaffold:

```bash
npm run new:collection
```

Create a new lecture in the active workflow:

```bash
npm run new:lecture
```

Check project readiness for preview, source-fidelity review, and static packaging:

```bash
npm run doctor
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
- `examples/component-demo.template.md`: valid demo of all supported components.
- `examples/multi-lecture/`: example collection scaffold for multi-lecture mode.
- `docs/mvp-review-checklist.md`: human pass/fail review checklist.
- `docs/golden-conversion-batch.md`: launch-decision record for the three-run golden conversion batch.
- `review-packages/`: generated static review packages, ignored by git.

## Multi-Lecture Collections

The engine supports a lightweight collection mode when a root-level `lectures/` directory exists with one or more numbered lecture subdirectories.

```text
lectures/
  course.yaml
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
- Optional `lectures/course.yaml` declares collection title, description, audience, level, and duration.

Collection mode takes precedence over `content/lecture.template.md` whenever `lectures/` exists. If `lectures/` is absent or empty, the app falls back to the single-lecture workflow and continues to render `content/lecture.template.md` exactly as before.

### Course Metadata

Course metadata is optional and separate from lecture frontmatter. When present, `lectures/course.yaml` must include non-empty `title` and `description` fields:

```yaml
title: "Course title"
description: "Short course description."
audience: "Technical educators and learners"
level: "beginner"
duration: "3 hours"
```

Optional P0 fields are `audience`, `level`, and `duration`. `level` must be `beginner`, `intermediate`, or `advanced`. Unknown fields are ignored. Valid metadata appears on the collection landing page, source-fidelity worksheets, `manifest.json`, and `MANIFEST.md`; invalid metadata blocks validation and review-package creation while still producing actionable errors.

### Authoring Commands

`npm run new:collection` creates `lectures/course.yaml`, `lectures/01-introduction/lecture.template.md`, and `lectures/01-introduction/raw-lecture.txt` when `lectures/` does not already exist. It refuses to overwrite an existing collection workspace.

`npm run new:lecture` creates `content/lecture.template.md` in single-lecture mode when it is missing. In collection mode, it creates the next numbered `lectures/<NN>-new-lecture/lecture.template.md` and `raw-lecture.txt`. Scaffold commands are non-interactive and never delete existing source files.

`npm run doctor` reports Node/npm versions, active mode, active template paths, course metadata status, lecture count, validation status, raw source evidence status, latest worksheet/package paths, and readiness for preview, source review, and static packaging. It exits `0` when diagnostics run successfully even if readiness warnings are present; it exits nonzero only when the project cannot be inspected.

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

The engine supports one template schema: YAML frontmatter plus Markdown body sections.

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
Rendered labels are `Note callout`, `Warning callout`, and `Insight callout`. Use callouts for short notes, warnings, or insights that need emphasis; do not use them for long recaps or source excerpts.

Concept card:

````markdown
```lecture-component
type: concept_card
title: "Core term"
body: "Compact explanation of one concept."
```
````

Rendered label: `Concept card`. Use a concept card for one compact term, rule, or mental model; do not use it as a general-purpose warning or summary.

Step list (`step_list`):

````markdown
```lecture-component
type: step_list
title: "Workflow"
steps:
  - "First step"
  - "Second step"
```
````

Authored type: `step_list`. Rendered label: `Step-by-step`. Use it for ordered workflows; do not use it for unordered facts.

Code block:

````markdown
```lecture-component
type: code_block
language: "bash"
code: "npm run validate"
```
````

Rendered label: `Code example`. Use it for commands, snippets, and short structured text; long lines scroll inside the block instead of widening the page.

Comparison:

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

Rendered label: `Comparison`. Use `comparison` for two-sided contrasts. `left_label` and `right_label` are optional and default to `Option A` and `Option B`. Do not use comparison for unrelated lists or more than two sides.

Summary:

````markdown
```lecture-component
type: summary
title: "What to remember"
items:
  - "Keep the validation contract small and explicit."
  - "Use components only when they clarify the source material."
```
````

Rendered label: `Section summary`. Use `summary` for a compact recap inside a section, not as a replacement for final key takeaways or a warning callout.

Quote:

````markdown
```lecture-component
type: quote
quote: "Small, source-grounded excerpt or named statement."
attribution: "Original lecture notes"
context: "Use this quote to introduce the section's main tradeoff."
```
````

Rendered label: `Source quote`. Use `quote` only for short source-grounded excerpts or named statements. `attribution` and `context` are optional. Do not invent quotes or paste long passages.

Quiz (`quiz`):

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

Rendered label: `Quiz: Knowledge check`. The authoring schema is unchanged: `question`, `options`, `answer`, and optional `explanation`. In interactive pages, the learner initially sees the question, options, and a `Show answer` button; the answer and explanation stay hidden until the learner clicks it. The same control toggles to `Hide answer` after reveal. Printed output includes the answer and explanation by default, and the no-JavaScript fallback is a `<noscript>` message that explains interactive reveal requires JavaScript while print remains available. Quiz reveal is a pacing aid, not secure assessment, grading, tracking, answer encryption, anti-cheating, learner accounts, analytics, or source-code secrecy.

Question set (`question_set`):

````markdown
```lecture-component
type: question_set
title: "Check Your Understanding"
instructions: "Answer each item before revealing feedback."
shuffle_options: true
questions:
  - question: "Which command validates the active lecture or collection?"
    options:
      - "npm run validate"
      - "npm run dev"
    answer: "npm run validate"
    feedback: "Validation catches schema and structure errors before preview or handoff."
  - question: "What does print output include?"
    options:
      - "Answers and feedback"
      - "Saved learner responses"
    answer: "Answers and feedback"
```
````

Rendered label: `Assessment: Question set`. Use `question_set` for grouped single-answer recall or comprehension checks. It requires a non-empty `title` and at least two questions. Each question requires non-empty `question`, at least two non-empty `options`, and an `answer` that exactly matches one option after trimming. Optional `feedback` is revealed per question. `shuffle_options` is preview-only after mount; authored order remains in source, static HTML, print output, and review packages. Multiple-answer mode is not supported in P0.

Free response (`free_response`):

````markdown
```lecture-component
type: free_response
title: "Explain The Tradeoff"
prompt: "Why should learners answer before revealing guidance?"
placeholder: "Draft your response here..."
guidance: "A drafted response makes comparison with model guidance more useful."
```
````

Rendered label: `Assessment: Free response`. Use `free_response` for short written reasoning, prediction, reflection, or design tradeoff prompts. It requires non-empty `title` and `prompt`; `guidance` and `placeholder` are optional. The textarea is local-only browser state. It is not saved, submitted, graded, tracked, or included as learner state in packages.

Practice task (`practice_task`):

````markdown
```lecture-component
type: practice_task
title: "Repair An Invalid Assessment"
scenario: "A generated template has a mismatched question_set answer."
task: "Use validation output to find and fix the invalid YAML."
steps:
  - "Run npm run validate."
  - "Inspect the reported field path."
hints:
  - "Look for questions[index].answer."
starter_code:
  language: "yaml"
  code: "type: question_set"
solution: "Make the answer exactly match one option."
rubric:
  - criterion: "Validation"
    expected: "The template validates without assessment field errors."
```
````

Rendered label: `Practice task`. Use `practice_task` for applied exercises, debugging tasks, coding/design scenarios, or self-evaluation. It requires non-empty `title` and `task`; optional fields are `scenario`, `steps`, `hints`, `starter_code`, `solution`, and `rubric`. Rubrics are visible by default. Hints and solutions are reveal controls on screen and visible in print. Hidden assessment content is a pacing aid only; it remains present in source templates, static HTML, print output, and review packages.

Lecture pages include assessment anchors and a printable answer-key appendix after Key Takeaways. Collection landing pages include an assessment index linking to `/lectures/<slug>#<assessment-anchor>` for valid lectures.

Unsupported custom component types still fail validation.

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
- Unsupported component type: use only `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, or `quiz`.
- Malformed YAML: check indentation, quotes, and key/value syntax.
- Empty list: add at least one bullet item or step.

## Previewing The Component Demo

To preview all supported components, preserve your active template first, then copy the visual gallery demo:

```bash
cp content/lecture.template.md /tmp/lecture.template.backup.md
cp examples/component-demo.template.md content/lecture.template.md
npm run validate
npm run dev
```

This replaces the active render template. The demo includes every supported component and long-content cases for comparison, quote, quiz, and code overflow review. Restore your lecture afterward:

```bash
cp /tmp/lecture.template.backup.md content/lecture.template.md
```

If you want to restore the shipping demo lecture, copy `examples/golden.template.md` to `content/lecture.template.md`.
