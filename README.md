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

Initialize a new consumer project with the Claude Code and Codex skills plus a starter lecture collection:

```bash
npx lecture-site-engine init
```

The initializer creates `lectures/course.yaml`, `lectures/01-introduction/lecture.template.md`, and `lectures/01-introduction/raw-lecture.txt`. It preserves existing skill files and authored templates.

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

## Use With Claude Code And Codex

This repository ships the lecture-authoring workflow as a project skill:

- Claude Code discovers `.claude/skills/lecture-site-engine/SKILL.md`.
- Codex discovers `.codex/skills/lecture-site-engine/SKILL.md`.
- Other agents can follow the root `SKILL.md` entry point.

The skill converts raw lecture source into the supported template schema, preserves source evidence, validates the result, and documents the review-package workflow. Read the skill before asking an agent to author or change lecture content.

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

- The root page renders a collection landing page with a primary start/resume/continue action near the course title.
- Each lecture is available at `/lectures/<slug>`, where `<slug>` is the numbered subdirectory name.
- Each lecture page includes previous/back-to-course/next navigation derived from authored collection order.
- Lecture pages in collection mode use collection-scoped progress storage.
- `npm run validate` validates every `lectures/*/lecture.template.md` file and reports per-lecture status.
- Optional `lectures/course.yaml` declares collection title, description, audience, level, and duration.
- Assessment locations are grouped by lecture behind a disclosure labeled "Assessment locations for reviewers".
- A secondary "View all lectures" anchor links to the lecture list when it is not visible near the first viewport.
- Validation status appears as secondary badges on lecture cards; it does not dominate the learner-facing hierarchy.

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

## Progress Tracking

Rendered lecture pages automatically include local learner progress controls for authored `## Section:` blocks. Learners can mark a section complete, see a lecture progress bar, reset lecture progress, use a resume prompt for partial progress, and use keyboard shortcuts:

- `Alt+M`: mark the current visible section complete or incomplete.
- `Alt+R`: reset progress after confirmation.

Progress is browser-only convenience state. It is not grading, analytics, account data, synced data, source evidence, or review-package content. Authors do not add progress fields or template syntax.

In collection mode, lecture progress is also written to a collection-scoped localStorage key so the collection landing page can display aggregate course progress. When a lecture page is rendered within a collection, toggling a section updates both the lecture-level and collection-level storage. Resetting lecture progress also removes the lecture entry from collection storage.

Collection landing pages show a primary start/resume/continue action based on aggregate progress, with the lecture list and assessment index as secondary content. Review and validation status appears as secondary badges on lecture cards without dominating the learner-facing hierarchy.

Storage uses `localStorage`:

```json
{
  "section-anchor": true
}
```

Single lecture keys use:

```text
lecture-progress:<lecture-id>
```

Collection landing pages read aggregate progress from:

```text
lecture-progress:collection:<collection-id>
```

Collection values are shaped as:

```json
{
  "lecture-slug": {
    "section-anchor": true
  }
}
```

Unknown lecture slugs, unknown section anchors, malformed JSON, arrays, null roots, and non-boolean values are ignored so changed templates recover cleanly. If storage is unavailable or blocked, the page remains readable and progress controls continue as unsaved session UI where possible. Without JavaScript, the static lecture content still renders; interactive progress controls do not persist.

Use the visible `Reset progress` button or `Alt+R` to clear the current lecture key. Clearing the relevant `localStorage` key in browser developer tools has the same effect after reload.

## Visual Design System

All styling lives in `src/app/globals.css`. There is no Tailwind, CSS Modules, or CSS-in-JS. New components and styles should follow the existing token and altitude system rather than inventing new colors or card treatments:

- **Body typeface**: loaded via `next/font/google` in `src/app/layout.tsx` and exposed as the `--font-body` CSS variable. Do not hardcode a font name in component CSS.
- **Semantic color tokens**: every content-type color traces to one of five tokens defined in `:root` (and mirrored for `prefers-color-scheme: dark`): `--brand`, `--info`, `--success`, `--warning`, `--neutral`, each with `-bg`, `-border`, and `-text` variants. Pick the token by what the content means (a definition is `--info`, a correct-answer state is `--success`, a mistake is `--warning`, an aside is `--neutral`, a primary learner action is `--brand`) — never add a new literal hex color to a component rule.
- **Card altitude system**: every `.lecture-component` also carries one altitude class:
  - `.surface-quiet` — low-stakes asides (glossary terms, resource links, instructor notes, quotes): border-top divider, no background tint.
  - `.surface-card` — the default teaching-component treatment (comparisons, steps, timelines, worked examples, tabs, accordions).
  - `.surface-emphasis` — the handful of things that should visually interrupt the reader (quizzes, question sets, practice tasks, free response, key takeaways, validation panels): heavier left border and a subtle shadow.
  When adding a new component, pick the altitude that matches its pedagogical weight, not its historical color.
- **Action color**: `--action`/`--action-hover` back every forward-moving control (quiz check/reveal, assessment reveal, resume prompt, collection primary action) so they share one visual identity.
- **Elevation**: `--shadow-sm`/`--shadow-md` are reserved for page-level surfaces (`.lecture-panel`, `.lecture-section`, `.validation-panel`, and `.surface-emphasis`). Nested component cards stay flat so elevation communicates page structure, not per-component competition.
- **Dark mode**: driven entirely by `prefers-color-scheme: dark` token overrides in `:root`; there is no separate dark-mode design pass per component. Print output (`@media print`) is unaffected and always forces light, high-contrast colors regardless of screen theme.
- **Motion**: reveal/expand interactions (`Tabs`, `Quiz`, assessment reveal regions, `Flashcard`, `Accordion`) use the `reveal-fade-in` keyframe animation, which fires correctly the moment `[hidden]`/`[open]` flips `display` away from `none` (a CSS transition cannot do this; a CSS animation can). All of it is disabled under `prefers-reduced-motion: reduce`.
- **Icons**: `src/components/component-kit/Icon.tsx` is the only source of inline SVG icons (chevron, check, warning, arrow-prev, arrow-next). Icons are decorative (`aria-hidden`) — the adjacent text always carries the accessible name.

## Component Architecture

`src/components/component-kit/` holds generic, domain-agnostic UI primitives: `Button`, `Card`, `Icon`, `Disclosure`/`useDisclosure`, `ProgressMeter`, `RadioOptionGroup`, `LabeledSection`. These components take no dependency on lecture-domain types or on `@/lib/lecture-template`, and could render unmodified in an unrelated app.

`src/components/lecture-kit/` holds every lecture-domain component (`Quiz`, `Callout`, `ConceptCard`, and the rest) and *composes* `component-kit` primitives rather than hand-rolling markup:

- A new component that needs the standard card shell (border, altitude, an eyebrow label, an optional title) composes `Card`, passing `altitude`, `label`, and `title` as props — it does not write its own `<aside className="lecture-component surface-...">` wrapper.
- A new interactive button composes `Button` (`variant="primary"` for forward-moving actions, `variant="ghost"` for resets/toggles) rather than a bare `<button>` with its own class.
- A reveal/hide interaction composes `useDisclosure()` (state + id generation) and, where the trigger is a plain toggle, `DisclosureTrigger` — rather than a fresh `useState` boolean and hand-wired `aria-expanded`/`aria-controls` pair.
- A progress bar composes `ProgressMeter`; a radio-button option list composes `RadioOptionGroup`; a `<h4>`-labeled subsection within a larger component composes `LabeledSection`.

Import direction is one-way: `lecture-kit` imports from `component-kit`; `component-kit` never imports from `lecture-kit`. Before adding a new visual or interactive pattern, check whether an existing `component-kit` primitive already covers it — the goal is that the next new lecture component is assembled from primitives, not copied from whichever existing file looks closest.

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

Advanced teaching components:

````markdown
```lecture-component
type: glossary_term
term: "Schema validation"
definition: "Checking authored template structure before preview or handoff."
context: "Use when a definition should stay close to the lesson."
aliases:
  - "template validation"
```
````

Use `glossary_term` for explicit definitions. Required fields are `term` and `definition`; optional fields are `context` and `aliases`.

````markdown
```lecture-component
type: tabs
title: "Compare Modes"
default_tab: "Browser"
tabs:
  - label: "CLI"
    content: "Use validation for fast schema feedback."
  - label: "Browser"
    content: "Use preview for layout and flow."
```
````

Use `tabs` for compact alternatives. It requires a `title` and at least two unique tab labels. `default_tab` must match one label. Static/no-JavaScript and print output include every panel.

````markdown
```lecture-component
type: accordion
title: "Optional Detail"
default_open: "When to use"
items:
  - title: "When to use"
    body: "Reveal optional depth without interrupting the main path."
```
````

Use `accordion` for optional depth. It requires a `title` and at least one item with `title` and `body`. `default_open` must match an item title.

````markdown
```lecture-component
type: timeline
title: "Implementation Path"
items:
  - label: "Draft"
    detail: "Write the component YAML."
  - date: "Step 2"
    label: "Validate"
    detail: "Run npm run validate."
```
````

Use `timeline` for ordered events, stages, releases, or learning paths. It requires at least two items. Optional `orientation` is `vertical` or `horizontal` and defaults to `vertical`.

````markdown
```lecture-component
type: checklist
title: "Readiness Check"
storage: session
reset_label: "Reset checklist"
items:
  - "Validation passes."
  - "Print output shows hidden content."
```
````

Use `checklist` for local learner readiness. Checklist state is browser-local only. It is never synced, submitted, exported, graded, or included in review packages. `storage` is `session` or `local` and defaults to `session`.

````markdown
```lecture-component
type: flashcard
category: "Recall"
prompt: "Which command validates templates?"
hint: "It runs before preview."
answer: "npm run validate"
```
````

Use `flashcard` for quick prompt-and-reveal practice. Answers are hidden by default on screen and visible in print/review output.

````markdown
```lecture-component
type: worked_example
title: "Fix A Field Error"
problem: "A generated component has an empty required field."
walkthrough:
  - "Read the validation field path."
  - "Replace the empty value with source-grounded text."
solution: "Run validation again and confirm the field error is gone."
takeaway: "Validation errors are authoring feedback, not learner content."
```
````

Use `worked_example` for problem, walkthrough, and solution teaching. Optional `starter_code`, `language`, and `takeaway` fields are supported.

````markdown
```lecture-component
type: mistake_correction
title: "Hidden Content Is Not Secure"
mistake: "Treating collapsed answers as secret."
why_it_fails: "The content remains in source, static HTML, print, and review packages."
correction: "Use hidden content only for pacing."
```
````

Use `mistake_correction` for wrong approach, failure reason, and correction. Optional before/after examples are `example_before` and `example_after`.

````markdown
```lecture-component
type: resource_links
title: "References"
links:
  - label: "Project README"
    url: "/README.md"
    description: "Local project guidance."
  - label: "External docs"
    url: "https://example.com/docs"
```
````

Use `resource_links` for curated references. URLs may be `http`, `https`, root-relative, relative local paths, or hash references. Unsafe schemes such as `javascript:` and protocol-relative URLs are rejected. Rendering does not fetch external resources.

````markdown
```lecture-component
type: instructor_note
title: "Facilitation Reminder"
audience: both
timing: "Before live review"
body: "Ask reviewers to compare hidden content with the source material."
```
````

Use `instructor_note` for teaching or reviewer guidance. `audience` is `instructor`, `reviewer`, or `both` and defaults to `instructor`.

Hidden, collapsed, answer, and instructor content is not secure. It is visible in source templates, static HTML, print output, and review packages. Review packages summarize component counts, resource links, local resource-link status where detectable, and instructor-note presence.

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
2. Claude Code auto-discovers the `lecture-site-engine` skill from `.claude/skills/lecture-site-engine/SKILL.md`. Codex discovers the matching entry point at `.codex/skills/lecture-site-engine/SKILL.md`; other agents can follow the root `SKILL.md` directly.
3. The agent should create or update `content/lecture.template.md`.
4. Run `npm run validate`.
5. Fix validation errors until the command passes.
6. Run `npm run review:source` and complete the generated source fidelity worksheet.
7. Run `npm run dev` and preview `http://localhost:3000`.
8. Review the result with `docs/mvp-review-checklist.md`.
9. When a handoff artifact is requested, run `npm run package:review` and send the generated `review-packages/<timestamp>-lecture-site/` folder to reviewers.

For the golden MVP workflow, use `examples/raw-lecture.txt` as the only raw source. Before giving the prompt to the agent, make `examples/golden.template.md` inaccessible and remove or replace `content/lecture.template.md` with a minimal non-golden placeholder if it contains the shipping demo answer. The agent-accessible workspace must not expose the golden answer until after generation and validation are complete. Record the batch in `docs/golden-conversion-batch.md`.

## Release The CLI

The package is configured for npm release as `lecture-site-engine`. Run the complete local release check before publishing:

```bash
npm run release:check
```

Inspect the `npm pack --dry-run` file list, then publish from an authenticated npm session when the release is approved:

```bash
npm publish
```

The package includes the CLI runtime and the root, Claude Code, and Codex skill entry points. GitHub publication still requires committing and pushing the approved changes to the repository configured in `package.json`.

## GitHub Actions

The repository includes two workflows:

- `.github/workflows/ci.yml` runs validation, lint, typecheck, tests, production build, CLI build, and npm package checks on pull requests targeting `main` and manual dispatches.
- `.github/workflows/release.yml` publishes the npm package when a semver Git tag is pushed. The tag supplies the package version: pushing `v0.2.0` publishes version `0.2.0`.

CI does not run for pushes to `main`; it runs for pull requests targeting `main` and manual dispatches. Before pushing a release tag, add an npm access token as the repository secret `NPM_TOKEN`. The release workflow uses npm provenance and requires the token to have permission to publish `lecture-site-engine`.

Create a release from a tag:

```bash
git tag v0.2.0
git push origin v0.2.0
```

## Common Validation Errors

- Missing frontmatter field: add the named field between the `---` lines.
- Invalid `level`: use `beginner`, `intermediate`, or `advanced`.
- Missing required section: add the exact heading named in the error.
- Out-of-order heading: use Overview, Learning Objectives, Section blocks, then Key Takeaways.
- Component outside section: move the fenced block inside a `## Section: <title>` block.
- Unsupported component type: use only the documented supported component types in this README.
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
