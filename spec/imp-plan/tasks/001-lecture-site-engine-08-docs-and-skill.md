# 001 Lecture Site Engine - 08 README, Skill, And Review Artifacts

## Goal

Write the human documentation, Codex skill instructions, and first-class review artifacts required for MVP launch and quality-bar evidence.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-04-validation-fixtures-cli.md`
- `001-lecture-site-engine-07-content-examples.md`

## Exact Files To Create Or Modify

- `README.md`
- `SKILL.md`
- `docs/mvp-review-checklist.md`
- `docs/golden-conversion-batch.md`
- `docs/educator-usefulness-log.md`

## Checklist

- [x] Write `README.md` covering:
  - [x] What the lecture site engine does.
  - [x] Node.js 24 LTS and bundled npm runtime expectation.
  - [x] `npm install`.
  - [x] `npm run dev`.
  - [x] `npm run validate`.
  - [x] Expected preview URL `http://localhost:3000`.
  - [x] Template paths, including `content/lecture.template.md`.
  - [x] Recommended custom raw source path `content/raw-lecture.txt`.
  - [x] Exact required frontmatter fields.
  - [x] Exact required headings and section order.
  - [x] Supported component types and exact `lecture-component` fenced YAML syntax.
  - [x] A complete synthetic example template not derived from `examples/raw-lecture.txt`.
  - [x] Common validation errors and mechanical fixes.
  - [x] Human workflow for asking an AI agent to follow `SKILL.md`.
  - [x] Link to `docs/mvp-review-checklist.md`.
  - [x] Link to `docs/golden-conversion-batch.md`.
  - [x] How to preview `examples/component-demo.template.md` by copying it to `content/lecture.template.md`.
  - [x] Warning that copying the component demo replaces the active template and how to preserve or restore the active template.
- [x] Write `SKILL.md` instructing Codex to:
  - [x] Read one raw lecture source.
  - [x] Extract title, audience, level, duration, objectives, sections, examples, caveats, practical steps, and takeaways from the source.
  - [x] Preserve source-grounded meaning and uncertainty.
  - [x] Avoid unsupported facts, statistics, tools, external references, or promises.
  - [x] Produce only the supported schema at `content/lecture.template.md`.
  - [x] Use only supported component types and exact payload shapes.
  - [x] Run `npm run validate` and iterate until validation passes.
  - [x] Optionally run or describe `npm run dev`.
- [x] Ensure README and `SKILL.md` mention golden file paths and protocol only as workflow artifacts.
- [x] Ensure README and `SKILL.md` do not reproduce, summarize section-by-section, or closely paraphrase `examples/golden.template.md` or the expected conversion of `examples/raw-lecture.txt`.
- [x] Create `docs/mvp-review-checklist.md` with explicit `[x] Pass / [x] Fail` fields for each item.
- [x] Include checklist items for metadata, objectives, section count, visual component usefulness, takeaways, and exact source-fidelity requirements:
  - [x] Every major claim is supported by `examples/raw-lecture.txt`.
  - [x] Important source examples, terminology, caveats, and practical steps are preserved unless omitted for clear concision.
  - [x] The generated lecture does not add unsupported facts, statistics, tools, external references, or promises.
  - [x] Any source uncertainty or incompleteness is preserved neutrally rather than resolved by invention.
  - [x] Reorganization and clarification do not change source meaning.
- [x] Create `docs/golden-conversion-batch.md` as a form-like launch record with:
  - [x] Codex product surface.
  - [x] Model identifier or unavailable note.
  - [x] Date.
  - [x] Repository commit or working tree state.
  - [x] Generation workspace setup.
  - [x] Validation output per run.
  - [x] Proof `examples/golden.template.md` was inaccessible.
  - [x] Starting active template status.
  - [x] Reviewer checklist result.
  - [x] Two-of-three pass/fail summary.
- [x] Create `docs/educator-usefulness-log.md` for non-blocking educator usefulness evidence.

## Expected Behavior

- A technical user can install, validate, preview, and understand the schema from README alone.
- Codex has deterministic instructions for converting raw lecture text into the supported template schema.
- MVP reviewers have concrete pass/fail artifacts for source fidelity, golden conversion launch evidence, and educator usefulness.
- Agent-accessible docs do not leak the golden answer before launch evaluation.

## Verification Commands

```bash
npm run validate
npm run test
```

Also manually inspect `README.md` and `SKILL.md` for golden-answer leakage before running the golden conversion batch.

## Cleanup Notes

- Do not paste generated golden lecture substance into README or `SKILL.md`.
- Keep completed launch-run evidence in `docs/golden-conversion-batch.md`; keep temporary generation workspaces outside the committed repository or remove them after recording results.
