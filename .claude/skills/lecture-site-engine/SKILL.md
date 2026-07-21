---
name: lecture-site-engine
description: Converts a raw lecture source into content/lecture.template.md (or a lectures/ collection) using the Lecture Site Engine schema, supported components, validation, and review-package workflow.
---

# Lecture Site Engine Skill

Use this skill to convert one raw lecture source into `content/lecture.template.md` in standalone mode, or into the confirmed numbered `lectures/<slug>/lecture.template.md` collection paths, using the supported Lecture Site Engine schema.

Every `npm run <command>` instruction below has an equivalent `npx lecture-site-engine <command>` form (same command names, e.g. `npx lecture-site-engine validate`, `npx lecture-site-engine new:lecture`, `npx lecture-site-engine dev`). Use the `npm run` form when working inside this repo; use the `npx` form when authoring in a project that doesn't have this repo cloned.

To bootstrap another project with this skill and a starter collection, run `npx lecture-site-engine init`. The initializer installs the root, Claude Code, and Codex skill entry points without overwriting existing authored files.

## Preview Command Contract

When the user asks to run or start the server, use `npm run dev` inside this repository or `npx lecture-site-engine dev` in a consumer project. The CLI prepares its generated app under the ignored `.lecture-site-engine/` directory, keeps the user's lecture files under `LECTURE_CONTENT_ROOT`, and starts the compatibility-safe Next preview path for the packaged app.

Treat the command as successful only after the process reports a ready local URL and an HTTP check returns a response. Report the exact URL, including a changed port when one is selected. If the command exits nonzero, report the first actionable error and fix or explain that CLI/runtime failure; do not bypass the CLI by launching Next from an npm cache or by changing the user's lecture files. The generated app directory is disposable runtime state and is not authored content.

## Staged Authoring Flow

Treat the repository's filesystem mode and the user's requested authoring scope as separate decisions. A `lectures/` directory tells the engine how to scan and validate the project; it does not decide whether the user wants one lecture or a course. In particular, `lectures/01-introduction/` created by `init` is a starter scaffold, not a course outline, a topic boundary, or a decision to create exactly one lecture.

Begin every lecture- or course-authoring request with a short source-aware intake:

1. Report the active single-lecture or collection mode, the relevant template/scaffold paths, the raw-source paths, and whether real human source evidence is present, missing, or a scaffold placeholder. Treat placeholders as non-evidence.
2. Classify the requested scope from the user's wording. A clear standalone request remains one lecture and stays standalone. An umbrella topic or broad curriculum request may need a collection. When that choice materially changes the output, ask one targeted question such as: “Do you want one standalone lecture or a multi-lecture collection? I recommend a collection because the topic is broad.” Do not ask a long questionnaire. If the request is clear, state the audience, level, boundaries, lecture count, and other assumptions before proceeding; never infer them from the starter scaffold.
3. Explain the source options. User-provided human raw source is the default. Agent-time internet research is available only after direct user authorization; missing or placeholder source alone does not authorize browsing, and research must never be written into a raw-source file.
4. Report the work in stages:
   - **Authoring brief:** selected mode and scope, working title, audience/level assumptions, source strategy, expected files, and immediate next step.
   - **Research brief:** only after explicit internet authorization, conduct bounded research using authoritative primary or current sources, then identify proposed concepts/sections and concise source links. Use the existing `resource_links` component for references; do not add research notes or copied web content to raw evidence.
   - **Scope checkpoint:** when scope remains material, show the proposed outline and source basis and wait for confirmation. For a clear request, state the outline and assumptions and proceed without an unnecessary extra turn.
   - **Draft:** generate the selected standalone template or the confirmed numbered collection. Create only the lecture count justified by the confirmed outline; do not silently turn a standalone request into a course.
   - **Verify and hand off:** run validation, source review, doctor, and package handoff when requested. The final report must name created or updated files, lecture count, validation result, human-source/evidence status, warnings, and the next command or user decision. Do not claim successful completion before validation and artifact paths are known.

This is agent guidance only. Do not add an interactive CLI, persisted authoring-session state, runtime URL fetching, a new citation or bibliography schema, a source-ingestion service, or a source-fabrication step.

## Inputs

- Read one user-supplied raw lecture source, or use a bounded, explicitly authorized agent-time research brief when human source is unavailable.
- For the MVP golden workflow, use `examples/raw-lecture.txt` as the only raw source.
- For a user's own lecture, prefer `content/raw-lecture.txt`.
- `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source fixtures under `examples/` are source evidence supplied by the user, educator, or an existing course source.
- Agents must never create, edit, rewrite, summarize into, replace, delete, or overwrite a raw-source file. Missing source requires asking the user for source material or direct authorization for agent-time research; missing or placeholder source alone does not authorize browsing. Never fabricate or AI-generate raw lecture input.
- Scaffold placeholders are not authored source evidence. Replace them with real human source before requesting source-fidelity approval. If human source is unavailable, an agent may author a derived draft only after direct user authorization for bounded internet research; the placeholder remains non-evidence.
- Agents may generate derived artifacts such as `lecture.template.md`, worksheets, diagnostics, review packages, and externally researched derived drafts, but may not author raw evidence. An externally researched result remains a derived draft and does not become present human source evidence.
- Use the supported `resource_links` component for concise references. It renders authored links without fetching them; do not add a citation field, bibliography schema, URL crawler, link checker, or runtime fetch promise.
- Do not read `examples/golden.template.md` while generating the golden template.

## Output

Create or update exactly the mode-appropriate artifact:

```text
Standalone: content/lecture.template.md
Collection: lectures/<slug>/lecture.template.md
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
- Never create, edit, rewrite, summarize into, replace, delete, or overwrite raw source files. Preserve existing templates unless the user explicitly asks.

Progress tracking is automatic in the rendered site for authored `## Section:` blocks. Do not add progress fields, localStorage keys, completion checkboxes, or custom progress syntax to lecture templates. Progress is runtime browser state only; it is not grading, analytics, source evidence, synced data, or review-package content. In collection mode, lecture progress is also written to collection-scoped storage so the landing page can display aggregate course progress.

## Multi-Lecture Collection Workflow

When the user has confirmed a collection and the repository contains a `lectures/` directory, treat it as a collection of lecture templates. Use numbered subdirectories so authored order stays obvious:

```text
lectures/
  01-introduction/
    lecture.template.md
  02-core-concepts/
    lecture.template.md
```

The existing `lectures/01-introduction/` directory may be only the starter created by `init`; it does not define the course size, topic boundaries, audience, or lecture count. For a collection:

1. Read the confirmed course outline or multi-lecture source. If the collection is based on explicitly authorized external research, use the approved research brief and outline instead; do not invent a raw course source.
2. Add `lectures/course.yaml` when the course title and description are known. This file is optional and separate from lecture frontmatter.
3. Create one numbered subdirectory per lecture under `lectures/`, preferably with `npm run new:lecture`.
4. Preserve user-supplied source evidence as `lectures/<slug>/raw-lecture.txt` for each lecture when per-lecture source is available. This is the default agent context for the requested lecture(s).
5. Preserve a shared source as `lectures/raw-course.txt` when one course source is split into multiple lectures. Read this optional shared source only when the user explicitly requests a shared-source split, cross-lecture reconciliation, or full-course review; its presence alone is not authorization to load it into agent context.
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

1. Complete the source-aware intake and, when needed, the research brief and scope checkpoint described above.
2. Read the requested raw lecture source completely. For an explicitly authorized external-research draft, use only the bounded approved research brief and source basis; do not treat it as human raw source.
3. Identify the lecture title, intended audience, likely level, duration, learning objectives, major sections, examples, caveats, practical steps, and takeaways.
4. Preserve source-grounded meaning. Reorganize and clarify, but do not add unsupported facts, statistics, tools, external references, or promises. For research-backed drafts, keep claims within the approved source basis and add concise references with `resource_links` when useful.
5. If the source is incomplete or uncertain, preserve that uncertainty in neutral wording.
6. Create 3-6 coherent ordered sections unless the source is clearly shorter.
7. Use visual components only when they improve comprehension.
8. Keep every component inside a `## Section: <section title>` block.
9. Run `npm run validate`. Use `npm run validate -- --json` when revising from machine-readable feedback.
10. Revise `content/lecture.template.md` or collection templates until validation passes.
11. Run `npm run review:source` before approval review so the reviewer has source paths, validation status, rendered routes, and checklist fields.
12. Run `npm run doctor` before preview, source-review, or package handoff.
13. Run or tell the user to run `npm run dev` and verify the reported local URL responds before calling the preview ready. In a consumer project use `npx lecture-site-engine dev`.
14. Finish with the staged handoff report: artifact paths, lecture count, validation status, human-source/evidence status, warnings, and next action.

## Source Fidelity Review

Raw sources are review evidence, not learner-facing render inputs.

- Single lecture raw source: `content/raw-lecture.txt`.
- Single lecture generated template: `content/lecture.template.md`.
- Collection per-lecture raw source: `lectures/<slug>/raw-lecture.txt`.
- Collection shared raw source: `lectures/raw-course.txt`.
- When both per-lecture and shared sources exist, treat per-lecture source as primary and shared source as optional additional evidence. Review tooling may inspect both files when present, but agent context remains opt-in for the shared file.

Raw-file handling cannot establish provenance cryptographically. The workflow can preserve paths, classify scaffold placeholders, and prevent agent-side mutation, but it cannot determine whether text supplied by a user was originally AI-generated.

An externally researched lecture or collection is a derived draft. It does not change a raw file's `present`, `missing`, or `placeholder` status, and it does not satisfy the human-source requirement for source-fidelity approval. `lectures/raw-course.txt` remains optional shared human evidence: its presence alone is not authorization to load it into agent context, and it is separate from internet-research authorization.

Run `npm run review:source` after validation work. The command creates `docs/review-worksheets/<timestamp>-source-fidelity-review.md` even when validation fails, because invalid state is useful review evidence. Missing raw source files should be reported, but they are not schema validation failures.

## Review Package Handoff

Create a static review package only when the user asks for a handoff artifact or the workflow explicitly calls for one. Do not export automatically after every lecture generation.

1. Create or update the single lecture template or collection templates.
2. Run `npm run validate`.
3. Revise templates until validation passes.
4. Run `npm run review:source` if the reviewer needs source fidelity evidence before handoff.
5. Run `npm run package:review`.
6. Report the generated `review-packages/<timestamp>-lecture-site/` path.

In the handoff report, also name the authored files and lecture count, state validation and human-source/evidence status, list warnings, and give the next command or user decision. A research-backed package must remain labeled as a derived draft with missing or placeholder human evidence when applicable.

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

Rendered label: `Quiz: Knowledge check`. Use `quiz` for lightweight knowledge checks with feedback revealed on demand. The required fields remain `question`, `options`, and `answer`; `explanation`, `id`, and `objective_refs` are optional. The `answer` must exactly match one option after trimming whitespace. Interactive pages initially show the question, options, and a `Show answer` button, then toggle to `Hide answer` after reveal. Printed output includes the answer and explanation by default. Without JavaScript, the answer is present in the static fallback. Quiz reveal is a pacing aid, not secure assessment, grading, learner tracking, answer encryption, anti-cheating, learner accounts, analytics, or source-code secrecy.

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

Rendered label: `Assessment: Free response`. Use `free_response` for written reasoning, predictions, reflections, or design explanations. It requires non-empty `title` and `prompt`; `guidance`, `placeholder`, `id`, and `objective_refs` are optional. The learner can mark the activity as understood or needing review; that state is local to the mounted component and is not saved, submitted, graded, tracked, or packaged.

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

Rendered label: `Practice task`. Use `practice_task` for applied work: coding, debugging, architecture, process, or self-evaluation tasks. It requires non-empty `title` and `task`; optional fields are `scenario`, `steps`, `hints`, `starter_code`, `solution`, `rubric`, `id`, and `objective_refs`. Rubrics are visible by default. Hints and solutions use reveal controls on screen and are visible in print; the learner can mark the task as understood or needing review using local component state.

All five assessment types share optional registry metadata:

```yaml
id: "stable-assessment-id"
objective_refs:
  - "objective-1"
```

`id` must be a unique lowercase ASCII identifier with hyphen-separated segments. It is registry identity only and never changes the generated page anchor. `objective_refs` is preserved as syntax-validated metadata; it is not resolved against free-text objectives yet. The assessment index includes flashcards, while answer review and authored answer keys include only objective choice activities (`quiz` and `question_set`). Choice attempts are the only assessment state persisted across reloads; stale selections and answers are discarded when authored options change. Other lifecycle state is local to the mounted component. All assessment answer, guidance, hint, and solution content remains available in static output and print.

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

### Advanced Component Chooser

- Use `glossary_term` for a local definition or vocabulary reminder.
- Use `tabs` for compact alternatives such as CLI/browser, modes, languages, or perspectives.
- Use `accordion` for optional depth that should not interrupt the main path.
- Use `timeline` for ordered events, stages, releases, or learning paths.
- Use `checklist` for local readiness or task completion; it is not grading or progress tracking.
- Use `flashcard` for quick prompt-and-reveal memory practice.
- Use `worked_example` for problem, walkthrough, and solution teaching.
- Use `mistake_correction` for wrong approach, failure reason, and corrected approach.
- Use `resource_links` for curated references; rendering does not fetch external URLs.
- Use `instructor_note` for facilitation or reviewer guidance.

````markdown
```lecture-component
type: glossary_term
term: "Schema validation"
definition: "Checking authored template structure before preview or handoff."
context: "Use when a definition should stay near the lesson."
aliases:
  - "template validation"
```
````

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

````markdown
```lecture-component
type: accordion
title: "Optional Detail"
items:
  - title: "When to expand"
    body: "Reveal optional depth without interrupting the main path."
```
````

````markdown
```lecture-component
type: timeline
title: "Implementation Path"
items:
  - label: "Draft"
    detail: "Write the component YAML."
  - label: "Validate"
    detail: "Run npm run validate."
```
````

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

````markdown
```lecture-component
type: flashcard
id: "command-recall"
prompt: "Which command validates templates?"
hint: "It runs before preview."
answer: "npm run validate"
```
````

Rendered label: `Flashcard`. Use `flashcard` for lightweight prompt-and-reveal recall. Optional `category`, `hint`, `id`, and `objective_refs` add presentation or registry metadata. Flashcards appear in assessment indexes but are not treated as graded answer-key entries.

````markdown
```lecture-component
type: worked_example
title: "Fix A Field Error"
problem: "A generated component has an empty required field."
walkthrough:
  - "Read the validation field path."
  - "Replace the empty value with source-grounded text."
solution: "Run validation again and confirm the field error is gone."
takeaway: "Validation errors are authoring feedback."
```
````

````markdown
```lecture-component
type: mistake_correction
title: "Hidden Content Is Not Secure"
mistake: "Treating collapsed answers as secret."
why_it_fails: "The content remains in source, static HTML, print, and review packages."
correction: "Use hidden content only for pacing."
```
````

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

`resource_links.url` may be `http`, `https`, root-relative, relative local paths, or hash references. Do not use `javascript:`, protocol-relative URLs, raw HTML embeds, remote fetching promises, or citation-manager behavior.

````markdown
```lecture-component
type: instructor_note
title: "Facilitation Reminder"
audience: both
timing: "Before live review"
body: "Ask reviewers to compare hidden content with the source material."
```
````

For advanced components, hidden/collapsed answers, instructor notes, and tab or accordion content are pacing aids only. They remain visible in source templates, static HTML, print output, and review packages. Checklist state is browser-local only; it is never synced, submitted, exported, graded, or included in review packages. Review packages summarize component counts, resource links, detectable local resource-link status, and instructor-note presence.

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
- The final report states the selected standalone/collection scope, created or updated files, lecture count, validation result, human-source/evidence status, warnings, and next action.
