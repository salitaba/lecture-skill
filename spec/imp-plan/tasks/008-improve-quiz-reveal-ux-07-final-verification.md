# Task: Final Verification And Review Package

## Goal

Run focused and broad checks for the completed quiz reveal UX, confirm no stale static-answer wording remains, and prepare a concise implementation handoff.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md`
- `008-improve-quiz-reveal-ux-02-styles-print.md`
- `008-improve-quiz-reveal-ux-03-interaction-tests.md`
- `008-improve-quiz-reveal-ux-04-static-render-tests.md`
- `008-improve-quiz-reveal-ux-05-docs-examples.md`
- `008-improve-quiz-reveal-ux-06-review-package-manual.md`

## Exact Files To Create Or Modify

- No new production or test files should be necessary for this task.
- Modify only files needed to fix failures found by the verification commands, and keep fixes aligned with the finalized plan.
- Read these files when preparing the final handoff:
  - `spec/008-improve-quiz-reveal-ux.txt`
  - `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`
  - `src/components/lecture-kit/Quiz.tsx`
  - `src/app/globals.css`
  - `tests/lecture-template/quiz-interaction.test.tsx`
  - `tests/lecture-template/lecture-components.test.tsx`
  - `README.md`
  - `SKILL.md`
  - `examples/component-demo.template.md`

## Checklist

- [x] Run the focused quiz interaction tests.
- [x] Run the static render component tests.
- [x] Run fixture and validator tests.
- [x] Run `npm run validate`.
- [x] Run `npm run typecheck`.
- [x] Run the full test suite when practical.
- [x] Run lint when practical.
- [x] Run production build when practical.
- [x] Run review-package generation when practical.
- [x] Search for stale static-answer wording across docs, examples, tests, and source.
- [x] Confirm no schema, parser, or validator changes were introduced for quiz.
- [x] Confirm no runtime network dependency, service call, persistence, analytics, grading, scoring, option selection, encryption, or external UI library was added.
- [x] Confirm tests do not assert answer-source absence as a security boundary.
- [x] Confirm print CSS uses `display: block !important` for `.quiz-answer[hidden]`.
- [ ] Confirm manual/browser review results are recorded in the handoff if not automated.
- [x] Check `git status` and summarize only files relevant to this spec.

## Expected Behavior

- A rendered quiz initially shows the label, question, options, and `Show answer`.
- The answer and optional explanation are hidden visually until reveal.
- The reveal control is a keyboard-operable native button with collapsed/expanded state and an associated answer region.
- Revealing one quiz does not reveal another quiz.
- Printed lectures include answer and explanation by default.
- Documentation, examples, and agent guidance describe the same behavior as the implementation.

## Verification Commands

Focused:

```bash
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run validate
npm run typecheck
```

Broad, when practical:

```bash
npm run test
npm run lint
npm run build
npm run package:review
```

Stale wording scan:

```bash
rg -n "Static answer key|static answer|visible answer key|hidden-answer|Show answer|Hide answer|Quiz: Knowledge check|quiz" README.md SKILL.md docs examples tests src
```

## Cleanup Notes

- Restore `content/lecture.template.md` if it was changed for manual demo or package verification.
- Stop any `npm run dev` process started during manual checks.
- Remove or document generated review-package artifacts according to existing repository practice.
- Do not revert unrelated uncommitted work; report unrelated changes separately if they appear in `git status`.
