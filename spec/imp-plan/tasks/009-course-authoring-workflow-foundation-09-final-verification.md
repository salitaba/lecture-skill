# Task: Final Verification

## Goal

Run focused and broad verification for the completed course authoring workflow foundation and prepare a concise handoff.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`
- `009-course-authoring-workflow-foundation-02-validation-json-cli.md`
- `009-course-authoring-workflow-foundation-03-landing-validation-ui.md`
- `009-course-authoring-workflow-foundation-04-source-review.md`
- `009-course-authoring-workflow-foundation-05-review-package.md`
- `009-course-authoring-workflow-foundation-06-scaffold-commands.md`
- `009-course-authoring-workflow-foundation-07-doctor-command.md`
- `009-course-authoring-workflow-foundation-08-docs-agent-guidance.md`

## Exact Files To Create Or Modify

- No new files should be necessary for this task.
- Modify only files needed to fix verification failures, and keep fixes aligned with the finalized plan.

## Checklist

- [x] Run focused metadata and collection tests.
- [x] Run validation CLI tests.
- [x] Run source review tests.
- [x] Run review package tests.
- [x] Run scaffold tests.
- [x] Run doctor tests.
- [x] Run `npm run validate`.
- [x] Run `npm run validate -- --json` and confirm stdout is parseable JSON.
- [x] Run `npm run doctor`.
- [x] Run `npm run typecheck`.
- [x] Run the full test suite when practical.
- [x] Run lint when practical.
- [x] Run production build when practical.
- [x] Run review package generation when practical.
- [ ] In a temp copy, run `new:collection`, `validate`, `doctor`, `review:source`, and `package:review`.
- [ ] Corrupt `lectures/course.yaml` in a temp copy and confirm validation, doctor, app rendering, source worksheet, and package preflight report metadata errors.
- [x] Check `git status` and summarize only files relevant to this spec.

## Expected Behavior

- Optional course metadata works across collection rendering, validation, source review, and review packages.
- Scaffold commands create non-destructive local authoring structures.
- Doctor reports readiness without failing on normal warnings.
- Existing single-lecture and metadata-absent collection workflows remain compatible.

## Verification Commands

Focused:

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts tests/lecture-template/validate-cli.test.ts
npm run test -- tests/lecture-template/source-review.test.ts tests/lecture-template/review-package.test.ts
npm run test -- tests/lecture-template/scaffold.test.ts tests/lecture-template/doctor.test.ts
npm run validate
npm run validate -- --json
npm run doctor
npm run typecheck
```

Broad, when practical:

```bash
npm run test
npm run lint
npm run build
npm run package:review
```

## Cleanup Notes

- Restore any real repo content changed during manual checks.
- Remove temp repo copies created for scaffold or corrupted-metadata manual checks.
- Stop any dev server started for browser verification.
- Do not revert unrelated uncommitted work; report it separately if relevant.
