# Task: Preflight Model And Source Snapshot

**Goal**: Implement the review-package preflight and manifest model so validation, copied sources, rendered route plans, and metadata are derived from one atomic validated snapshot.

**Dependencies**: `004-static-review-package-01-helper-tests.md`

## Files to Create/Modify

- `src/lib/lecture-template/reviewPackage.ts` — New review-package preflight, model, manifest, and source comparison helpers
- `src/lib/lecture-template/types.ts` — Modify only if shared review-package interfaces belong with existing lecture-template types

## Checklist

- [x] Add `ReviewPackageMode = "single-lecture" | "collection"`.
- [x] Add interfaces for `ReviewPackagePreflight`, `ReviewPackageLecture`, `ReviewPackageManifest`, and package contents/source records.
- [x] Implement `runReviewPackagePreflight()` using `isCollectionMode()`.
- [x] In single-lecture mode, read and validate `content/lecture.template.md`.
- [x] In collection mode, scan and validate every active `lectures/<slug>/lecture.template.md`.
- [x] Reuse existing validation and formatting behavior from `validateTemplateSource`, `validateTemplateFile`, `validateCollectionCli`, or `formatError` as appropriate so failures remain author-locatable.
- [x] Return invalid preflight results with validation output and no package directory creation.
- [x] Capture exact validated template source contents during preflight.
- [x] Include source template paths and package destination paths:
  - single mode: `source/content/lecture.template.md`
  - collection mode: `source/lectures/<slug>/lecture.template.md`
- [x] Build an exported route plan:
  - single mode: root `index.html`
  - collection mode: root `index.html` plus each `lectures/<slug>/index.html`
- [x] Derive per-lecture manifest metadata from validated templates only: slug, title, description, audience, level, duration, source template path, rendered output path, and section count.
- [x] Do not include raw lecture prose in the manifest model.
- [x] In collection mode, record inactive `content/lecture.template.md` as ignored metadata only if useful; do not copy it as an active source.
- [x] Implement a pre-build source comparison helper that compares current template file contents to the captured preflight contents and fails on drift.
- [x] Add git commit, dirty tree, Node.js version, and npm version metadata helpers that degrade to `unavailable` when commands fail.

## Expected Behavior

- All later package steps consume one preflight result instead of re-reading source files independently.
- Source files copied into the package match the contents that passed validation.
- If source changes between preflight and build, packaging fails before `next build`.
- Collection ordering and lecture count match `scanLectureCollection()`.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
```

## Cleanup Notes

- Helper tests must clean temp repositories as described in task 01.
- Preflight helpers must not create `review-packages/`, `out/`, `.next-review/`, or any package staging directory.
