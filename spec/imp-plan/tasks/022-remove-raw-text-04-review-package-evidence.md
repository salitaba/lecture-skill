# Task 04: Preserve Only Real Raw Evidence in Review Packages

## Objective

Keep review-package evidence discovery limited to the canonical expected paths, retain an auditable record for missing/placeholder paths, and copy only present human source files.

## Dependencies

- Task 02: use the centralized classifier and three-state status.
- Task 03: align package worksheet labels with source-review labels.

## Exact Files to Modify

- `src/lib/lecture-template/reviewPackage.ts`
- `src/cli/commands/packageReview.ts`
- `scripts/packageReview.ts`

## Implementation Details

- Extend `ReviewPackageRawEvidenceRecord.status` to include `"placeholder"` while retaining `sourcePath`, `packagePath`, `role`, and `lectureSlug` fields.
- Capture single-lecture, per-lecture collection, and optional shared evidence only from `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, and `lectures/raw-course.txt`. Do not discover arbitrary `raw-lecture`-named files such as `lectures/notes/raw-lecture.txt`.
- Preserve manifest records for missing and placeholder expected paths, but populate `contents` and `manifest.contents.rawSourceEvidence` only for `present` evidence. `writeCapturedRawEvidence` and package assembly must skip both missing and placeholder records.
- Update source snapshot verification to verify only present raw evidence; missing and placeholder records have no captured contents to verify and must not cause false failures.
- Ensure `createPackageWorksheet` adds only a present shared source as additional lecture context, while still rendering the shared record’s optional status in the package manifest. Primary placeholder records must remain visible and non-copied.
- Update `renderReviewPackageManifestMarkdown`, `renderReviewPackageReadme`, and package worksheet labels to identify primary human source evidence, optional shared human source evidence, generated lecture templates, and scaffold placeholders not copied into the package.
- Update both package command implementations to report included human source, missing primary evidence, and ignored scaffold placeholders separately. Missing/placeholder shared evidence must not block a valid package; missing/placeholder primary evidence remains auditable but follows the existing nonfatal evidence behavior.
- Do not change package route generation, template snapshot behavior, course metadata handling, or package directory cleanup.

## Acceptance Criteria

- A valid collection package includes present per-lecture and shared human sources, excludes unrelated raw-like files, and never copies a scaffold placeholder.
- `manifest.json` and `MANIFEST.md` retain records for expected missing/placeholder paths and preserve role/path compatibility.
- Package worksheets never list a placeholder as additional source context and clearly explain why it was not copied.
- Snapshot verification ignores missing/placeholder records and still detects changes to present human source.

## Verification / Tests

```bash
npm test -- tests/lecture-template/review-package.test.ts
npm run typecheck
```

Task 06 adds deterministic package assertions for present, missing, placeholder, shared, and unrelated raw-like files.

## Cleanup Notes

- Package tests must use temporary package roots and remove staging/output directories in teardown.
- Never delete or overwrite a source file in the repository as part of package assembly; only copy present evidence into the generated package.
