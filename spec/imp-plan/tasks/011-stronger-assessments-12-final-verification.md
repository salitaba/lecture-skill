# Task: Final Verification

## Goal

Run focused and full verification for stronger assessments, confirm P0 scope is complete, and summarize only relevant changes.

## Dependencies

- `011-stronger-assessments-01-types-anchors.md`
- `011-stronger-assessments-02-validation-normalization.md`
- `011-stronger-assessments-03-validation-cli-fixtures.md`
- `011-stronger-assessments-04-assessment-collector.md`
- `011-stronger-assessments-05-question-set-component.md`
- `011-stronger-assessments-06-free-response-component.md`
- `011-stronger-assessments-07-practice-task-component.md`
- `011-stronger-assessments-08-rendering-index-answer-key.md`
- `011-stronger-assessments-09-styles-print.md`
- `011-stronger-assessments-10-examples-docs-skill.md`
- `011-stronger-assessments-11-package-link-tests.md`

## Exact Files To Create Or Modify

- No new production or test files should be necessary for this task.
- Modify only files needed to fix failures found by verification.
- Read these files before final handoff:
  - `spec/011-stronger-assessments.txt`
  - `spec/imp-plan/011-stronger-assessments-plan.txt`
  - `src/lib/lecture-template/types.ts`
  - `src/lib/lecture-template/validateTemplate.ts`
  - `src/lib/lecture-template/assessments.ts`
  - `src/components/lecture-kit/QuestionSet.tsx`
  - `src/components/lecture-kit/FreeResponse.tsx`
  - `src/components/lecture-kit/PracticeTask.tsx`
  - `src/components/lecture-kit/AnswerKeyAppendix.tsx`
  - `src/components/lecture-kit/LecturePage.tsx`
  - `src/components/lecture-kit/CollectionLanding.tsx`
  - `src/app/globals.css`
  - `README.md`
  - `SKILL.md`

## Checklist

- [x] Run all focused validation, render, interaction, CLI, collection, and package tests from the plan.
- [x] Run full test suite and confirm no regressions.
- [x] Run typecheck and lint.
- [x] Run `npm run validate` and confirm the active template or configured collection validates.
- [x] Confirm `quiz` authoring schema is unchanged and existing quiz interaction tests still pass.
- [x] Confirm new assessment components are rejected outside `## Section:` blocks.
- [x] Confirm nested validation errors retain exact `field`, `componentType`, `sectionTitle`, and locator data.
- [x] Confirm all assessment anchors are stable and duplicate titles get suffixes.
- [x] Confirm answer-key appendix includes quiz answers, question-set answers/feedback, free-response guidance, and practice-task hints/solution/rubric.
- [x] Confirm collection assessment index skips invalid lectures and links to `/lectures/<slug>#<anchor>`.
- [x] Confirm print CSS exposes hidden guidance and hides reveal controls.
- [x] Confirm README and `SKILL.md` document local-only, non-secure, non-grading behavior.
- [x] Check `git status` and summarize files relevant to spec 011 only; do not revert unrelated work.

## Expected Behavior

- `question_set`, `free_response`, and `practice_task` are fully supported in validation, rendering, examples, docs, print output, and review packages.
- Existing `quiz` behavior remains backward compatible, with only normalized/rendered anchors added.
- All tests, typecheck, lint, and validation pass.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/assessment-interaction.test.tsx
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
npm run test -- tests/lecture-template/validate-cli.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
npm run lint
npm run validate
npm run test
```

## Cleanup Notes

- Remove or ignore generated `review-packages/` output from manual package verification according to existing project workflow.
- Restore `content/lecture.template.md` if it was changed for manual preview/package checks.
- Do not revert or overwrite unrelated uncommitted edits by others.
