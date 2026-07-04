# Task: Add Assessment Types And Stable Anchors

## Goal

Add the normalized TypeScript contract for stronger assessment components and stable assessment anchors without changing author-facing `quiz` YAML.

## Dependencies

- None

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts` - Add assessment interfaces, union members, and normalized `QuizComponent.anchor`.
- `src/lib/lecture-template/anchors.ts` - Add a reusable unique-anchor helper for assessment anchors while preserving section anchor behavior.
- `tests/lecture-template/anchors.test.ts` - Add focused coverage for the new helper and preserve current section-anchor tests.

## Checklist

- [x] Add exported `QuestionSetQuestion`, `QuestionSetComponent`, `FreeResponseComponent`, `StarterCode`, `PracticeRubricItem`, and `PracticeTaskComponent` interfaces matching `spec/imp-plan/011-stronger-assessments-plan.txt`.
- [x] Add `"question_set"`, `"free_response"`, and `"practice_task"` to `LectureComponentType`.
- [x] Add the new assessment interfaces to the `LectureComponent` union.
- [x] Add `anchor: string` to `QuizComponent` as normalized render data only.
- [x] Do not add an author-facing `anchor` YAML field to any component.
- [x] Add a generic unique anchor helper, for example `uniqueAnchors(labels, fallbackBase)`, that uses the existing slug format and duplicate suffix style.
- [x] Keep `slugifySectionTitle` and `uniqueSectionAnchors` behavior unchanged.
- [x] Add tests proving duplicate assessment labels produce stable suffixes.
- [x] Add tests proving section anchors still match existing expectations.

## Expected Behavior

- TypeScript exposes the four assessment component shapes: legacy `quiz` with normalized anchor plus new `question_set`, `free_response`, and `practice_task`.
- Existing valid templates remain valid once normalization is updated in later tasks.
- Anchor generation can be reused by validation/normalization for section-scoped assessment ids.
- Existing section anchor output is unchanged.

## Verification Commands

```bash
npm run test -- tests/lecture-template/anchors.test.ts
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when the expanded `LectureComponent` union is fully dispatched by the renderer.

## Cleanup Notes

- This task should not create temporary data.
- Do not modify render components, examples, documentation, or package code in this task.
