# Task: Add Assessment Collector Helpers

## Goal

Create pure helpers that collect assessment index and answer-key data from normalized lectures and collections.

## Dependencies

- `011-stronger-assessments-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/assessments.ts` - New pure helper module for assessment summaries and answer-key entries.
- `tests/lecture-template/render-model.test.ts` - Add helper model coverage if this is the best fit.
- `tests/lecture-template/collection.test.ts` - Add multi-lecture collection coverage for assessment summaries.

## Checklist

- [x] Add helper types for assessment summaries and answer-key entries using existing normalized `LectureTemplate` and `CollectionValidationResult` types.
- [x] Include `quiz`, `question_set`, `free_response`, and `practice_task` in collection index output.
- [x] Include answer/guidance/solution/rubric material for all four assessment types in answer-key output.
- [x] Include lecture slug/title, section title/anchor, component type, assessment title or prompt, and component anchor.
- [x] Skip invalid collection results by requiring `result.valid && result.template`.
- [x] Keep helpers pure and free of browser APIs, React, file system access, and route rewriting.
- [x] Add tests for a lecture with multiple assessments in source order.
- [x] Add tests for a collection with valid and invalid lectures, proving invalid lectures are skipped.

## Expected Behavior

- Rendering code can build the course assessment index and printable answer-key appendix from one normalized data source.
- The collector does not duplicate validation logic or infer data from raw YAML.
- Index and appendix output stays stable when a section contains multiple assessments with duplicate titles.

## Verification Commands

```bash
npm run test -- tests/lecture-template/render-model.test.ts
npm run test -- tests/lecture-template/collection.test.ts
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when the renderer switch covers the expanded component union.

## Cleanup Notes

- This task should not create temporary data.
- Do not add React components or CSS in this task.
