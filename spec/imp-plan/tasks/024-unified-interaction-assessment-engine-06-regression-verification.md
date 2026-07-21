# Task: Run Full Unified Assessment Verification

## Goal

Verify the complete implementation, resolve regressions, and perform a final
code-quality review against the spec and plan.

## Dependencies

- All previous `024-unified-interaction-assessment-engine-*` tasks.

## Exact Files To Create Or Modify

- Only files required to fix verified issues found during verification.
- Do not modify raw-source evidence.

## Checklist

- [ ] Run focused validation, registry, runtime, review, collection, progress,
  CLI, and package tests.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run build:cli`.
- [ ] Run `npm run validate`.
- [ ] Inspect the diff for unchanged existing anchors and storage keys.
- [ ] Confirm no runtime network dependency or answer-state leak was added.
- [ ] Confirm `git diff --check` passes.
- [ ] Run an independent tech-lead review of the changed files and fix every
  verified actionable finding.

## Expected Behavior

- The full project verification passes.
- Existing templates remain valid without adding metadata.
- New activity registry metadata and flashcard index behavior are covered by
  tests.
- Any residual risk is documented rather than hidden.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run build:cli
npm run validate
git diff --check
```

## Cleanup Notes

- Remove only temporary test/build artifacts created by the verification flow
  when the repository's existing commands do not clean them automatically.
- Preserve unrelated user changes in the worktree.

