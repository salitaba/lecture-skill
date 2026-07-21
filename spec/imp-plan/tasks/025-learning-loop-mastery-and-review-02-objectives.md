# Task: Normalize Structured Learning Objectives

## Goal

Add stable, lecture-local objective records and backward-compatible validation
for explicit objective IDs while preserving the existing Markdown list shape
and visible rendering of legacy objectives.

## Dependencies

- `025-learning-loop-mastery-and-review-01-fixtures.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts`
- `src/lib/lecture-template/parseTemplate.ts`
- `src/lib/lecture-template/validateTemplate.ts`
- `src/components/lecture-kit/LecturePage.tsx`
- `tests/lecture-template/parseTemplate.test.ts`
- `tests/lecture-template/validateTemplate.test.ts`
- `tests/lecture-template/lecture-components.test.tsx`
- `tests/lecture-template/backward-compat.test.tsx`
- `tests/lecture-template/fixtures.test.ts`

## Checklist

- [x] Add the normalized `LearningObjective` contract with `id`, `text`,
  `isExplicit`, `idLocator`, and `textLocator`, and change
  `LectureTemplate.objectives` to use it.
- [x] Retain per-item list-line locators while preserving existing list-item
  parsing for non-objective Markdown lists.
- [x] Parse the anchored `[objective-id] text` form using the plan’s grammar and
  `isAnchorSafeAssessmentId()`.
- [x] Treat malformed bracket-prefixed objective items, empty or invalid IDs,
  and missing text as author-locatable validation errors; keep ordinary
  unmarked items as legacy objectives.
- [x] Generate ordered, collision-safe, display-only IDs for legacy items,
  mark them `isExplicit: false`, and never resolve references to them.
- [x] Report duplicate explicit IDs and explicit/generated collisions with both
  the ID and text source locations where available.
- [x] Resolve assessment references only after objective normalization; leave
  no-assessment objectives as advisory coverage signals for the diagnostics
  task.
- [x] Update lecture objective rendering to display only `objective.text` and
  preserve the existing objectives anchor and navigation hierarchy.
- [x] Update parser, validator, rendering, and backward-compatibility tests to
  assert structured records without changing answer-key or storage contracts.

## Expected Behavior

- Explicit IDs are stable and referenceable only within their lecture.
- Legacy objectives remain valid and visibly unchanged, but their generated IDs
  are marked non-explicit and cannot become learner-state keys.
- Invalid objective syntax and unresolved explicit references fail validation
  with useful source context; objectives without assessments do not fail a
  valid lecture.

## Verification Commands

```bash
npm run test -- tests/lecture-template/parseTemplate.test.ts tests/lecture-template/validateTemplate.test.ts tests/lecture-template/lecture-components.test.tsx tests/lecture-template/backward-compat.test.tsx
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not silently migrate existing lecture templates or alter authored source
  evidence while updating consumers and tests.
