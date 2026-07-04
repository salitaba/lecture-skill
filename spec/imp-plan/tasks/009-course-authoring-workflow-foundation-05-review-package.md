# Task: Static Review Package Course Metadata

## Goal

Include valid course metadata in review package manifests and copied sources, and block package creation when course metadata is invalid.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`
- `009-course-authoring-workflow-foundation-04-source-review.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/reviewPackage.ts` - Refactor collection preflight, metadata capture, snapshot verification, manifest, `MANIFEST.md`, and assembly.
- `tests/lecture-template/review-package.test.ts` - Add metadata manifest, copy, invalid preflight, and snapshot tests.

## Checklist

- [x] Refactor `runCollectionPreflight()` around `validateCollection()` or a shared metadata-aware validation helper.
- [x] Avoid maintaining a second lecture-only validation path.
- [x] Add optional course metadata to collection preflight data.
- [x] Make invalid course metadata produce invalid preflight and block `npm run package:review`.
- [x] Add optional course metadata to `ReviewPackageManifest`.
- [x] Copy valid `lectures/course.yaml` to `source/lectures/course.yaml`.
- [x] Model captured metadata as distinct from lecture template sources.
- [x] Include metadata source in snapshot verification.
- [x] Expose metadata source separately in `manifest.contents` and `MANIFEST.md`.
- [x] Render a `## Course Metadata` section in `MANIFEST.md`.

## Expected Behavior

- Review packages identify the course when metadata exists.
- `manifest.json` and `MANIFEST.md` include course metadata without misclassifying `course.yaml` as a lecture template.
- Metadata changes after preflight are caught before package assembly.

## Verification Commands

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run package:review
npm run typecheck
```

## Cleanup Notes

- Package tests should use temporary `review-packages/` roots.
- `npm run package:review` may create a real review package in this repo; leave it if consistent with existing practice or report the generated path.
