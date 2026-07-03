# Task: Source Review Model

**Goal**: Implement the shared source-review module that discovers expected raw source evidence, captures validation state, builds worksheet models for single and collection modes, and renders source-fidelity Markdown.

**Dependencies**: `005-source-fidelity-review-workflow-01-source-review-model-tests.md`

## Files to Create/Modify

- `src/lib/lecture-template/sourceReview.ts` — Create the source-review model, discovery, worksheet creation, and Markdown rendering module
- `src/lib/lecture-template/collection.ts` — Modify only to extract or export existing preview metadata helpers needed for invalid collection lectures
- `src/lib/lecture-template/validateCli.ts` — Modify only if validation summary rendering must be shared to avoid duplicate or divergent output
- `src/lib/lecture-template/types.ts` — Modify only if source-review types must be shared outside `sourceReview.ts`
- `tests/lecture-template/source-review.test.ts` — Update expectations only as implementation details settle, without weakening behavior

## Checklist

- [x] Define source-review constants for `content/raw-lecture.txt`, `content/lecture.template.md`, `lectures/raw-course.txt`, `lectures/<slug>/raw-lecture.txt`, and `docs/review-worksheets/`.
- [x] Define source-review types in `sourceReview.ts`, including mode, validation status, source evidence status, worksheet, lecture, evidence, and package context records.
- [x] Use `repositoryPath()` and repository-relative POSIX paths in worksheet models and Markdown.
- [x] Implement `createSourceReviewWorksheet()` or equivalent as the reusable model builder.
- [x] Detect mode with `isCollectionMode()` so source review, validation, app rendering, and packaging agree.
- [x] In single-lecture mode, read `content/lecture.template.md`, run `validateTemplateSource()`, capture metadata and section count when valid, capture validation errors when invalid, and locate `content/raw-lecture.txt`.
- [x] In collection mode, use `scanLectureCollection()` for authored order and evaluate every collection lecture independently.
- [x] For invalid templates, preserve available preview metadata and section context while marking source fidelity approval as not ready.
- [x] Mark `lectures/<slug>/raw-lecture.txt` as primary collection evidence and `lectures/raw-course.txt` as additional shared evidence when present.
- [x] Set rendered routes to `/` for single mode and collection landing, and `/lectures/<slug>` for collection lectures.
- [x] Implement `renderSourceReviewWorksheetMarkdown(worksheet)` with the single and collection sections required by the plan.
- [x] Include explicit `[ ] Pass / [ ] Fail / [ ] Needs revision` fields for source fidelity, educational quality, rendered-output inspection, notes, required revisions, and overall result.
- [x] Keep raw sources as review evidence only; do not feed them into rendering or validation.

## Expected Behavior

- A worksheet model can be created even when validation fails.
- Invalid lectures are clearly marked as not ready for source fidelity approval.
- Present and missing raw source evidence are recorded predictably.
- The Markdown renderer produces a complete human-review worksheet for both single-lecture and collection modes.

## Verification

```bash
npm run test -- tests/lecture-template/source-review.test.ts
npm run typecheck
```

## Cleanup Notes

- Source-review tests must remove temp repositories after each test.
- Do not create real `docs/review-worksheets/` files from helper-level tests.
