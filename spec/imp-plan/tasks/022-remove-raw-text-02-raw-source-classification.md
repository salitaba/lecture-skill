# Task 02: Centralize Raw-Source Evidence Classification

## Objective

Create one raw-source evidence helper that preserves the existing primary/shared path and role contracts while classifying every expected raw file as `present`, `missing`, or `placeholder`.

## Dependencies

- Task 01: the guidance contract is established.
- Preserve `SourceReviewEvidenceRole = "primary" | "shared"` and `COLLECTION_SHARED_RAW_SOURCE_PATH = "lectures/raw-course.txt"`.

## Exact Files to Create or Modify

- **Create**: `src/lib/lecture-template/rawSourceEvidence.ts`

Downstream consumers are updated in Tasks 03 and 04. Keep this task focused on the shared classifier API; do not modify those consumers here.

## Implementation Details

- Export the raw-source path constants currently owned by `sourceReview.ts`, including `SINGLE_RAW_SOURCE_PATH`, `COLLECTION_SHARED_RAW_SOURCE_PATH`, and the collection per-lecture filename/path helper or an equivalent centralized path API.
- Export a status union with exactly `"present" | "missing" | "placeholder"` and preserve the existing `primary`/`shared` role union. Keep `sourcePath`, `role`, `lectureSlug`, and package-path fields stable; `placeholder` is the only additive status.
- Define and export the exact scaffold sentinel used by `scaffold.ts`, initially `Add raw source evidence for this lecture here.\n`. Do not invent or auto-create a shared-course placeholder because `lectures/raw-course.txt` remains user-created and optional.
- Provide a shared async read/classification helper that resolves repository-relative paths, returns `missing` for an absent expected file, returns `placeholder` only for the exact scaffold sentinel, and returns `present` with captured contents for all other readable files. Preserve unexpected filesystem errors rather than silently classifying them as evidence.
- Make classification independent of agent context: it is a repository evidence operation used by source review, doctor, and package assembly.
- Define an API that lets downstream consumers stop deciding “exists means present” independently. Keep worksheet/package JSON paths and role fields backward-compatible apart from the new status.
- Treat a primary placeholder as non-ready source evidence and a shared placeholder as optional non-evidence. Do not make either placeholder a schema validation failure by itself.

## Acceptance Criteria

- There is one implementation of the placeholder sentinel and status classification used by source review, doctor, and review-package code.
- A missing path, exact scaffold marker, and arbitrary human-authored content produce `missing`, `placeholder`, and `present`, respectively.
- Existing real `raw-course.txt` files remain readable and classify as `present`.
- No helper creates, writes, replaces, or deletes raw-source files.

## Verification / Tests

```bash
npm test -- tests/lecture-template/source-review.test.ts tests/lecture-template/doctor.test.ts tests/lecture-template/review-package.test.ts
npm run typecheck
```

The focused tests will be expanded in Task 06 with explicit three-state and sentinel cases.

## Cleanup Notes

- Keep repository writes out of the project root during tests; use temporary directories and restore `process.cwd()`.
- Do not change lecture-template or course-metadata schemas.
