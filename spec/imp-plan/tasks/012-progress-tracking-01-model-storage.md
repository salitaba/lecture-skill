# Task: Add Progress Model And Storage Helpers

## Goal

Create pure progress data helpers for storage keys, validation, and percentage calculations without touching browser APIs.

## Dependencies

None.

## Exact Files To Create Or Modify

- `src/lib/lecture-template/progress.ts` - New pure progress model/helper module.
- `tests/lecture-template/progress-model.test.ts` - New unit tests for keys, validation, and calculations.

## Checklist

- [x] Define `LectureProgress` and `CollectionProgress` runtime types.
- [x] Add `singleLectureProgressKey(lectureId)` and `collectionProgressKey(collectionId)` returning the exact spec key prefixes.
- [x] Add a centralized `sanitizeProgressId(value)` helper for stable key ids.
- [x] Add lecture progress validation that accepts only non-array objects with known section anchors and boolean values.
- [x] Add collection progress validation that accepts only known lecture slugs and known section anchors per lecture.
- [x] Drop unknown anchors/slugs so changed templates recover cleanly.
- [x] Add calculation helpers for lecture and collection totals, completed counts, and integer percentages.
- [x] Cover malformed roots, arrays, null, non-boolean values, empty sections, unknown anchors, and normal partial/complete progress in tests.

## Expected Behavior

Progress data can be parsed and normalized safely before any React provider writes it back to localStorage. Empty or malformed data produces empty progress without throwing.

## Verification Commands

```bash
npm run test -- tests/lecture-template/progress-model.test.ts
npm run typecheck
```

## Cleanup Notes

This task should not create browser storage, fixture files, or generated artifacts.
