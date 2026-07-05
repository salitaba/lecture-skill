# Task: Final Progress Tracking Verification

## Goal

Run the focused and full verification suite for progress tracking and confirm the implementation did not change authoring schema behavior.

## Dependencies

- `012-progress-tracking-01-model-storage.md`
- `012-progress-tracking-02-provider.md`
- `012-progress-tracking-03-lecture-ui.md`
- `012-progress-tracking-04-collection-ui.md`
- `012-progress-tracking-05-accessibility-polish.md`
- `012-progress-tracking-06-styles-print.md`
- `012-progress-tracking-07-doctor-package-docs.md`

## Exact Files To Create Or Modify

- No production files expected.
- Update only task/checklist documentation if verification exposes stale instructions.

## Checklist

- [x] Run all focused progress model/provider/rendering tests.
- [x] Run collection, doctor, and review-package tests.
- [x] Run existing assessment and backward-compatibility tests to catch interaction regressions.
- [x] Run full test, typecheck, lint, and validate commands.
- [x] Manually inspect single lecture preview in a browser if a dev server is available.
- [x] Manually inspect collection landing progress if collection mode fixtures are available.
- [x] Verify localStorage keys match the spec exactly.
- [x] Verify clearing localStorage resets UI after reload.
- [x] Verify no authoring schema or validation rule changes were introduced.

## Expected Behavior

Progress tracking works in single and collection modes, degrades safely when storage is unavailable, and existing lecture authoring/rendering behavior remains intact.

## Verification Commands

```bash
npm run test -- tests/lecture-template/progress-model.test.ts
npm run test -- tests/lecture-template/progress-provider.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/doctor.test.ts
npm run test -- tests/lecture-template/review-package.test.ts
npm run test
npm run typecheck
npm run lint
npm run validate
```

## Cleanup Notes

Remove any generated `.next/`, `out/`, or `review-packages/` artifacts created during manual verification unless they are already ignored and intentionally retained locally.
