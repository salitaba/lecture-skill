# Task: Source-Fidelity Worksheet Course Metadata

## Goal

Include collection-level course metadata in source-fidelity worksheets and make invalid metadata part of the worksheet validation result.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`
- `009-course-authoring-workflow-foundation-02-validation-json-cli.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/sourceReview.ts` - Add course metadata to collection worksheets and validation output.
- `tests/lecture-template/source-review.test.ts` - Cover valid, absent, and invalid metadata cases.

## Checklist

- [x] Refactor collection worksheet creation to use `validateCollection()` or the same metadata-aware validation helper as the CLI.
- [x] Extend `SourceReviewWorksheet` with collection-level metadata status/path.
- [x] Render a `## Course Metadata` section before lecture review in collection mode.
- [x] Include title, description, audience, level, duration, source mode, lecture count, validation result, and metadata path/status when available.
- [x] State clearly when metadata is absent and inferred labels are used.
- [x] Include course metadata errors when metadata is invalid.
- [x] Mark worksheet validation as failed when metadata is invalid.
- [x] Preserve the existing behavior that worksheet creation exits `0` when validation fails but the worksheet is written.

## Expected Behavior

- Reviewers can identify the collection from declared course metadata in worksheets.
- Invalid course metadata is visible in review evidence.
- Per-lecture source evidence behavior remains unchanged.

## Verification Commands

```bash
npm run test -- tests/lecture-template/source-review.test.ts
npm run typecheck
```

## Cleanup Notes

- Source review tests create temp worksheet directories; remove them in `afterEach`.
- Do not change source-fidelity checklist semantics.
