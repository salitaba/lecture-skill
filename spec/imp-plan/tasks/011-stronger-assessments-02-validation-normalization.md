# Task: Add Assessment Validation And Normalization

## Goal

Teach the template validator to accept, validate, normalize, and anchor `question_set`, `free_response`, and `practice_task` components while preserving existing `quiz` behavior.

## Dependencies

- `011-stronger-assessments-01-types-anchors.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/validateTemplate.ts` - Add supported component types, nested validation helpers, section-aware normalization, and assessment anchor assignment.
- `tests/lecture-template/validateTemplate.test.ts` - Add valid, invalid, normalization, anchor, and backward-compatibility coverage.
- `tests/lecture-template/render-model.test.ts` - Add render-model assertions if this file owns normalized component shape coverage.

## Checklist

- [x] Add `"question_set"`, `"free_response"`, and `"practice_task"` to `supportedComponents`.
- [x] Change section normalization to pass each section anchor into `normalizeBlocks`; keep overview and takeaway normalization behavior unchanged.
- [x] Generate stable `anchor` values for `quiz`, `question_set`, `free_response`, and `practice_task` using section anchor, component type, title/question fallback, and occurrence suffixes.
- [x] Add reusable nested error helpers that preserve `INVALID_COMPONENT_FIELD`, `locator`, `sectionTitle`, `componentType`, and exact `field` paths.
- [x] Validate `question_set.title`, optional `instructions`, optional boolean `shuffle_options`, at least two `questions`, mapped question entries, non-empty `question`, at least two non-empty `options`, non-empty `answer`, answer matching a trimmed option, and optional non-empty `feedback`.
- [x] Validate `free_response.title`, `free_response.prompt`, optional non-empty `guidance`, and optional non-empty `placeholder`.
- [x] Validate `practice_task.title`, `practice_task.task`, optional non-empty `scenario`, optional non-empty `steps` and `hints` lists, optional `starter_code.language` and `starter_code.code`, optional non-empty `solution`, and optional non-empty rubric items with `criterion` and `expected`.
- [x] Normalize all strings by trimming and preserve authored list order.
- [x] Keep `question_set` single-answer only in P0; do not add multiple-answer mode.
- [x] Preserve all existing validation semantics for `quiz`, `diagram`, and other component types.

## Expected Behavior

- Valid new assessment components pass validation only inside `## Section:` blocks.
- Malformed nested fields report stable field paths such as `questions[0].options[1]`, `starter_code.language`, and `rubric[0].expected`.
- Normalized assessment components include anchors from one source of truth.
- Existing quiz fixtures and quiz validation failures still pass or fail for the same reasons, except normalized quiz objects now include `anchor`.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when renderer exhaustiveness has been updated for all new union members.

## Cleanup Notes

- This task should not create temporary data.
- Do not modify renderer components, CSS, examples, or docs in this task.
