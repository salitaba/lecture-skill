# Task: Final Source Fidelity Review Verification

**Goal**: Run full automated and manual verification for the source fidelity review workflow in single-lecture mode, collection mode, missing-source scenarios, invalid-template worksheet generation, and static review package evidence.

**Dependencies**: `005-source-fidelity-review-workflow-01-source-review-model-tests.md`, `005-source-fidelity-review-workflow-02-source-review-model.md`, `005-source-fidelity-review-workflow-03-review-source-cli.md`, `005-source-fidelity-review-workflow-04-package-raw-evidence-snapshot.md`, `005-source-fidelity-review-workflow-05-package-worksheet-manifest.md`, `005-source-fidelity-review-workflow-06-docs-and-examples.md`, `005-source-fidelity-review-workflow-07-integration-tests.md`

## Files to Create/Modify

- No production files required unless verification exposes a defect
- `tests/lecture-template/source-review.test.ts` — Modify only if verification exposes missing deterministic coverage
- `tests/lecture-template/review-package.test.ts` — Modify only if verification exposes missing deterministic coverage
- Relevant implementation or docs files from earlier tasks — Modify only to fix verified defects

## Checklist

- [x] Run the focused source-review and package tests.
- [x] Run the full automated quality gate.
- [x] Run `npm run review:source` in single-lecture mode with `content/raw-lecture.txt` present.
- [x] Inspect the generated `docs/review-worksheets/<timestamp>-source-fidelity-review.md`.
- [x] Confirm the worksheet includes source mode, validation result, template path, raw source path, route, metadata, checklist fields, reviewer fields, notes, and overall result.
- [x] Temporarily test single-lecture mode with missing `content/raw-lecture.txt` and confirm warning/worksheet behavior is nonfatal.
- [x] Run `npm run review:source` in collection mode with per-lecture raw sources.
- [x] Confirm every lecture has its own worksheet section with route, template path, primary source status, validation status, metadata, checklist, and notes.
- [x] Temporarily test collection mode with `lectures/raw-course.txt` and confirm it is listed as shared additional context.
- [x] Temporarily introduce one invalid collection lecture and confirm worksheet generation still succeeds and includes the valid lectures.
- [x] Run `npm run package:review` with present raw sources.
- [x] Inspect package `REVIEW_WORKSHEET.md`, `manifest.json`, `MANIFEST.md`, `README.md`, reviewer files, and `source/`.
- [x] Confirm raw sources are copied only when they exist at expected paths.
- [x] Confirm missing raw source files produce warnings but do not block packaging.
- [x] Confirm generated template source copying is unchanged.
- [x] Restore all temporarily modified content after manual checks.

## Expected Behavior

- `npm run review:source` creates useful worksheet evidence for valid and invalid lectures.
- `npm run package:review` includes package-local source fidelity review artifacts when templates are valid.
- Missing raw source evidence is visible in terminal output, worksheets, manifests, and package artifacts, but does not fail packaging.
- No learner-facing rendering behavior changes because raw sources remain review evidence only.

## Verification

```bash
npm run test -- tests/lecture-template/source-review.test.ts tests/lecture-template/review-package.test.ts
npm run validate
npm run test
npm run typecheck
npm run lint
npm run review:source
npm run package:review
```

## Cleanup Notes

- Restore any temporarily invalid template content before finishing.
- Restore collection/single-mode fixture state used for manual smoke checks.
- Remove local-only worksheets under `docs/review-worksheets/` after recording verification results if they are not intended for audit history.
- Remove local-only smoke packages under `review-packages/` if they are not needed for handoff.
- Remove only `out/`, `.next-review/`, or staging directories created during the verification run.
