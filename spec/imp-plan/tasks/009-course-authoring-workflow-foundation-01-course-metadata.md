# Task: Course Metadata Model And Collection Validation

## Goal

Add optional `lectures/course.yaml` support and thread its validation result through collection scanning and validation without changing the lecture template schema.

## Dependencies

- Finalized plan: `spec/imp-plan/009-course-authoring-workflow-foundation-plan.txt`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/courseMetadata.ts` - New parser/validator for `lectures/course.yaml`.
- `src/lib/lecture-template/types.ts` - Add `CourseMetadata` and metadata validation result types.
- `src/lib/lecture-template/collection.ts` - Include course metadata in `scanLectureCollection()` and `validateCollection()`.
- `tests/lecture-template/collection.test.ts` - Add metadata parser and collection validation coverage.

## Checklist

- [x] Define `COURSE_METADATA_PATH = "lectures/course.yaml"`.
- [x] Parse metadata with the existing `yaml` dependency.
- [x] Return a discriminated result for `absent`, `valid`, and `invalid`.
- [x] Require non-empty `title` and `description` when the file exists.
- [x] Validate optional known fields as non-empty strings when present.
- [x] Validate `level` as `beginner`, `intermediate`, or `advanced`.
- [x] Ignore unknown fields in P0.
- [x] Reject malformed YAML and non-mapping YAML roots.
- [x] Include stable error codes, field names, hints, and useful locator context.
- [x] Extend `LectureCollection` and `CollectionValidationResult` with metadata status.
- [x] Keep absent metadata compatible with existing collections.
- [x] Ensure invalid metadata makes `CollectionValidationResult.allPassed` false while lecture validation still runs.

## Expected Behavior

- Existing collections without `lectures/course.yaml` still validate exactly as collection mode did before.
- Valid `lectures/course.yaml` is available to rendering, CLI, source review, and package flows.
- Invalid course metadata is reported as blocking validation but does not hide lecture-level errors.

## Verification Commands

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run typecheck
```

## Cleanup Notes

- Tests should use temporary directories and remove them in `afterEach`.
- Do not modify active repository `lectures/` fixtures except through existing checked-in examples if a fixture update is explicitly needed.
