# Task: Final Static Review Package Verification

**Goal**: Run full automated and manual smoke verification for single-lecture mode, collection mode, invalid preflight blocking, file-protocol navigation, and responsive review behavior.

**Dependencies**: `004-static-review-package-01-helper-tests.md`, `004-static-review-package-02-preflight-model.md`, `004-static-review-package-03-static-export-routes.md`, `004-static-review-package-04-cli-build-staging.md`, `004-static-review-package-05-package-assembly-rewrite.md`, `004-static-review-package-06-manifests-reviewer-files.md`, `004-static-review-package-07-project-docs.md`

## Files to Create/Modify

- No production files required unless verification exposes a defect
- `tests/lecture-template/review-package.test.ts` — Modify only if verification exposes missing deterministic coverage
- Relevant implementation files from earlier tasks — Modify only to fix verified defects

## Checklist

- [x] Run the full automated quality gate:
  - `npm run validate`
  - `npm run test`
  - `npm run typecheck`
  - `npm run lint`
- [x] Run `npm run package:review` in single-lecture mode with no active root `lectures/` collection.
- [x] Open or inspect the printed single-mode `index.html` path directly from the filesystem.
- [x] Confirm single-mode package includes:
  - rendered `index.html`
  - copied assets
  - `manifest.json`
  - `MANIFEST.md`
  - `README.md`
  - `REVIEW_CHECKLIST.md`
  - `source/content/lecture.template.md`
- [x] Run `npm run package:review` in collection mode using a valid two-lecture collection.
- [x] Open or inspect the printed collection `index.html` path directly from the filesystem.
- [x] Confirm collection landing links to every lecture.
- [x] Confirm next/previous and back-to-course links work without a dev server.
- [x] Confirm every active `lectures/<slug>/lecture.template.md` is copied under `source/`.
- [x] Confirm inactive `content/lecture.template.md` is not copied as an active source in collection mode.
- [x] Temporarily introduce an invalid template.
- [x] Run `npm run package:review` and confirm it exits nonzero, prints validation details, and creates no completed package.
- [x] Restore valid content after invalid-preflight verification.
- [x] Check package pages at 390px, 768px, and 1280px.
- [x] Confirm `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [x] Confirm keyboard navigation and visible focus states still work.
- [x] Confirm package README/manifest/source links wrap cleanly.
- [x] Verify `npm run dev` still reflects template edits without requiring a restart after route export changes.

## Expected Behavior

- The feature passes helper tests and full repo quality gates.
- Both single-lecture and collection packages open offline from `file://`.
- Invalid templates never produce completed review packages.
- Responsive and keyboard review behavior remains consistent with the local preview.
- Normal authoring workflow remains unchanged.

## Verification

```bash
npm run validate
npm run test
npm run typecheck
npm run lint
npm run package:review
```

Manual verification:

```bash
npm run dev
```

Use the dev server only to confirm normal authoring still reflects template edits. The package itself must be verified from the printed filesystem `index.html` path without the dev server.

## Cleanup Notes

- Restore any temporarily invalid template content before finishing.
- Restore collection/single-mode fixture state used for manual smoke checks.
- Remove local-only smoke packages under `review-packages/` after recording verification results if they are not needed for handoff.
- Remove only `out/`, `.next-review/`, or staging directories created during the verification run.
