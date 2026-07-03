# Task: Package Worksheet And Manifests

**Goal**: Generate package-local `REVIEW_WORKSHEET.md` from the package preflight snapshot and expose raw source evidence status in package manifests and reviewer-facing files.

**Dependencies**: `005-source-fidelity-review-workflow-04-package-raw-evidence-snapshot.md`

## Files to Create/Modify

- `src/lib/lecture-template/reviewPackage.ts` — Add package worksheet creation, manifest fields, Markdown manifest section, reviewer files, and package README updates
- `scripts/packageReview.ts` — Print worksheet path, included raw source paths, and missing evidence warnings
- `tests/lecture-template/review-package.test.ts` — Extend tests for package worksheet, manifests, reviewer files, README, and CLI summary behavior where practical

## Checklist

- [x] Build the package worksheet model from the existing `ReviewPackagePreflight` plus final package context.
- [x] Do not call a fresh repository-scanning `createSourceReviewWorksheet()` during package assembly.
- [x] Include package path, package entry HTML path, per-lecture rendered output paths, and package source paths for templates and raw sources.
- [x] Write `REVIEW_WORKSHEET.md` at the review package root.
- [x] Add `REVIEW_WORKSHEET.md` to `reviewerFiles`.
- [x] Update package `README.md` so reviewers start with `REVIEW_WORKSHEET.md`.
- [x] Keep `REVIEW_CHECKLIST.md` unless there is an explicit, tested reason to remove duplicate content.
- [x] Extend `manifest.json` with raw source evidence paths and statuses, without raw source contents.
- [x] Add a distinct `Raw Source Evidence` section to `MANIFEST.md`, separate from `Source Templates`.
- [x] Clearly mark present and missing evidence in `manifest.json`, `MANIFEST.md`, and `REVIEW_WORKSHEET.md`.
- [x] Keep package creation dependent on valid generated templates, matching current `package:review` behavior.
- [x] Update `scripts/packageReview.ts` summary to print the package directory, open path, package `REVIEW_WORKSHEET.md` path, included raw source paths, and missing-source warnings.
- [x] Omit completed reviewer-status extraction unless an exact-label parser is intentionally added and tested.

## Expected Behavior

- Every completed review package contains `REVIEW_WORKSHEET.md` built from the same source snapshot as the package.
- Package manifests and terminal output make missing raw source evidence hard to overlook.
- Raw source contents are copied into `source/` when present but are not embedded in JSON.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run package:review
npm run typecheck
```

## Cleanup Notes

- Tests must remove temp package directories and staging output.
- Manual `npm run package:review` may create real `review-packages/` output; remove local smoke packages if they are not intended for handoff.
