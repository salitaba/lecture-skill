# Task: Run Final Learning Loop Verification

## Goal

Verify the complete implementation against the finalized plan, accessibility
requirements, static/no-JavaScript behavior, privacy boundaries, and existing
regressions.

## Dependencies

- `025-learning-loop-mastery-and-review-01-fixtures.md`
- `025-learning-loop-mastery-and-review-02-objectives.md`
- `025-learning-loop-mastery-and-review-03-objective-evidence.md`
- `025-learning-loop-mastery-and-review-04-review-scheduler.md`
- `025-learning-loop-mastery-and-review-05-review-state-adapters.md`
- `025-learning-loop-mastery-and-review-06-assessment-retry.md`
- `025-learning-loop-mastery-and-review-07-single-lecture-ux.md`
- `025-learning-loop-mastery-and-review-08-collection-ux.md`
- `025-learning-loop-mastery-and-review-09-diagnostics-package.md`
- `025-learning-loop-mastery-and-review-10-docs.md`

## Exact Files To Create Or Modify

- No planned new files.
- Only files required to fix a verified regression may be modified during this
  task; preserve the scope of the finalized plan.

## Checklist

- [x] Run focused objective, evidence, scheduler, provider, retry, single-
  lecture, collection, CLI, doctor, review-package, static/export, and print
  tests.
- [x] Run the full Vitest suite, typecheck, lint, production build, and CLI
  build.
- [x] Run `npm run validate`, `npm run doctor`, `npm run review:source`, and
  `npm run package:review`.
- [x] Exercise new, partial, due, demonstrated-recently, corrupted-state, and
  localStorage-unavailable flows in single-lecture and collection modes.
- [x] Verify 375px/mobile wrapping, desktop layout, keyboard-only operation,
  200% zoom, dark mode, reduced motion, static export, print output, and
  no-JavaScript authored content.
- [x] Confirm authored lecture order, objective/assessment anchors, existing
  answer-attempt keys, annotations, answer review, and section reset behavior
  are unchanged.
- [x] Confirm learner review records, due dates, attempts, drafts, and answer
  text are absent from validation output, logs, static packages, and manifests.
- [x] Run `git diff --check` and inspect the final diff for unrelated changes.
- [x] Perform an independent code-quality/accessibility review and fix every
  verified actionable issue within the finalized plan’s scope.

## Expected Behavior

- All required checks pass, learner state remains local-only and excluded from
  reviewer output, and existing reading, assessment, export, print, and
  no-JavaScript contracts remain valid.
- Any external or environment-specific limitation is reported explicitly with
  the exact command and failure reason.

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run build:cli
npm run validate
npm run doctor
npm run review:source
npm run package:review
git diff --check
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit or regenerate them.
- Remove only temporary verification/package artifacts created by commands when
  the repository’s normal cleanup does not handle them. Preserve unrelated
  worktree changes.
