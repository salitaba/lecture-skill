# Task: Source Review Integration Tests

**Goal**: Add focused end-to-end coverage across the source-review CLI and package workflow after the core model, package evidence, and documentation slices are implemented.

**Dependencies**: `005-source-fidelity-review-workflow-03-review-source-cli.md`, `005-source-fidelity-review-workflow-05-package-worksheet-manifest.md`

## Files to Create/Modify

- `tests/lecture-template/source-review.test.ts` — Add integration-style tests for CLI worksheet file creation and invalid validation behavior if not already covered
- `tests/lecture-template/review-package.test.ts` — Add cross-feature package assertions for raw evidence, package worksheet, and manifest consistency
- `tests/lecture-template/testUtils.ts` — Modify only if shared temp-repo/package helpers reduce duplication cleanly

## Checklist

- [x] Add a script-level or subprocess test that `scripts/reviewSource.ts` creates `docs/review-worksheets/<timestamp>-source-fidelity-review.md` for an invalid template.
- [x] Assert the invalid-template CLI output says validation failed and exits `0`.
- [x] Assert the generated worksheet marks source fidelity approval as not ready until validation passes.
- [x] Add a package test that raw source paths reported in `manifest.json`, `MANIFEST.md`, and `REVIEW_WORKSHEET.md` agree.
- [x] Add a package test that package `README.md` and reviewer files list include `REVIEW_WORKSHEET.md`.
- [x] Add a package test that missing raw source evidence appears in all reviewer-facing package artifacts and does not fail assembly.
- [x] Add a package test that present raw source evidence is copied only from expected paths and only into the intended `source/` paths.
- [x] Add coverage for both single-lecture and collection package contexts when feasible without duplicating helper-level tests.
- [x] Keep tests deterministic and avoid invoking a real `next build` unless existing review-package test helpers already isolate that path.

## Expected Behavior

- The source-review CLI, package manifests, package worksheet, and copied evidence agree on raw source status.
- Invalid worksheet generation is covered at the script boundary.
- Package tests prove reviewer-facing artifacts expose enough evidence to perform source fidelity review.

## Verification

```bash
npm run test -- tests/lecture-template/source-review.test.ts tests/lecture-template/review-package.test.ts
npm run typecheck
```

## Cleanup Notes

- Keep all integration fixtures under temp directories.
- Remove generated `docs/review-worksheets/`, package output, staging output, and build output created by tests.
