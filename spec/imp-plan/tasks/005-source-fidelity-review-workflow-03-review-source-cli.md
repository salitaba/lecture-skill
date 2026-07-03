# Task: Review Source CLI

**Goal**: Add `npm run review:source` so authors can generate a timestamped source-fidelity worksheet under `docs/review-worksheets/` with a concise terminal summary.

**Dependencies**: `005-source-fidelity-review-workflow-02-source-review-model.md`

## Files to Create/Modify

- `scripts/reviewSource.ts` — Create the CLI entrypoint
- `package.json` — Add the `review:source` script
- `tests/lecture-template/source-review.test.ts` — Add controlled subprocess or script-level tests for CLI behavior

## Checklist

- [x] Create `scripts/reviewSource.ts` using the existing TypeScript script pattern.
- [x] Add `"review:source": "node --import ./scripts/register-ts-loader.mjs scripts/reviewSource.ts"` to `package.json`.
- [x] Ensure the command creates `docs/review-worksheets/` when needed.
- [x] Write `docs/review-worksheets/<timestamp>-source-fidelity-review.md`.
- [x] Print worksheet path, mode, validation passed/failed, lecture count, missing raw source paths, and a reminder that human review fields still need completion.
- [x] Exit `0` when validation fails but worksheet creation succeeds.
- [x] Exit nonzero only when an IO or unexpected runtime error prevents worksheet creation.
- [x] Warn, but do not fail, when raw source files are missing.
- [x] Add a CLI test where an invalid template still creates a worksheet, prints validation failed, and exits `0`.
- [x] Add a CLI test where worksheet directory/file creation fails and the process exits nonzero.

## Expected Behavior

- Authors can run `npm run review:source` in either single-lecture or collection mode.
- Validation failure becomes recorded worksheet evidence rather than a command failure.
- Missing raw source evidence is obvious in terminal output and in the worksheet.

## Verification

```bash
npm run test -- tests/lecture-template/source-review.test.ts
npm run review:source
npm run typecheck
```

## Cleanup Notes

- CLI tests must use temp repositories and remove generated `docs/review-worksheets/` data afterward.
- Manual verification may create real worksheet files under `docs/review-worksheets/`; remove local-only generated worksheets if they are not intended for handoff.
