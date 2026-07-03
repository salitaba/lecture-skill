# Task: Source Review Model Tests

**Goal**: Add deterministic tests that define the source-review worksheet model, raw evidence discovery, validation status handling, and Markdown rendering contract before production implementation.

**Dependencies**: None

## Files to Create/Modify

- `tests/lecture-template/source-review.test.ts` — Create focused tests for source-review helpers and Markdown output
- `tests/lecture-template/testUtils.ts` — Modify only if existing fixture helpers can be reused without broadening scope

## Checklist

- [x] Create `tests/lecture-template/source-review.test.ts`.
- [x] Follow the temp-directory and `process.chdir()` cleanup pattern used by `tests/lecture-template/collection.test.ts`.
- [x] Add single-lecture model tests for a valid `content/lecture.template.md` with present `content/raw-lecture.txt`.
- [x] Add single-lecture model tests for a valid template with missing `content/raw-lecture.txt`.
- [x] Add single-lecture invalid-template tests that still expect a worksheet model, validation failure, validation errors, and preview title/section context when parseable.
- [x] Add collection tests for per-lecture `lectures/<slug>/raw-lecture.txt` evidence.
- [x] Add collection tests for shared `lectures/raw-course.txt` evidence.
- [x] Add collection tests where both per-lecture and shared sources exist, with per-lecture evidence marked primary and shared evidence marked additional context.
- [x] Add collection tests where one invalid lecture and one valid lecture both appear in the worksheet model.
- [x] Add missing-source tests that mark expected evidence paths as `missing` without failing worksheet creation.
- [x] Add Markdown renderer assertions for required source-fidelity checklist items, reviewer fields, validation result, routes, source paths, missing-source labels, and package context when provided.
- [x] Keep tests independent of `npm run review:source` file writes; CLI file creation is covered in a later task.

## Expected Behavior

- Tests specify that worksheet generation works for valid and invalid lectures.
- Missing raw source evidence is visible but nonfatal.
- Collection worksheet records are per lecture and do not drop valid lectures because another lecture is invalid.
- Markdown output is deterministic except timestamp and optional package paths.

## Verification

```bash
npm run test -- tests/lecture-template/source-review.test.ts
npm run typecheck
```

## Cleanup Notes

- Any test-created repository state must live under `mkdtempSync(os.tmpdir())`.
- Restore `process.cwd()` in `afterEach`.
- Remove temporary directories with `rmSync(tempRoot, { recursive: true, force: true })`.
- Do not write to real `content/`, `lectures/`, `docs/review-worksheets/`, `out/`, or `review-packages/` in the repository root from these tests.
