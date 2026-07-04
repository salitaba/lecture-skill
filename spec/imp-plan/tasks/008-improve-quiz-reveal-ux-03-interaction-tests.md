# Task: Quiz DOM Interaction Tests

## Goal

Add focused DOM interaction coverage for the quiz reveal toggle, including accessibility state, visible hidden-state behavior, optional explanation reveal, and multiple independent quizzes.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md`
- `008-improve-quiz-reveal-ux-02-styles-print.md` for final class names and hidden-state behavior.
- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`

## Exact Files To Create Or Modify

- `package.json` - Add dev-only DOM test dependencies.
- `package-lock.json` - Update lockfile for the new dev dependencies.
- `tests/lecture-template/quiz-interaction.test.tsx` - Create focused jsdom interaction tests.
- `vitest.config.ts` - Read only; keep the global test environment as `node` unless a narrow config change is necessary. Prefer a file-level jsdom environment comment in the new test.

## Checklist

- [x] Add dev dependencies for `jsdom`, `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom` if using jest-dom matchers.
- [x] Create `tests/lecture-template/quiz-interaction.test.tsx`.
- [x] Add a file-level Vitest jsdom environment comment so existing Node tests remain Node tests.
- [x] Render `Quiz` directly with a component containing a question, at least two options, answer, and explanation.
- [x] Assert initial render includes `Quiz: Knowledge check`, question, ordered options, and a `Show answer` button.
- [x] Assert the reveal control is a real button with `type="button"`, `aria-expanded="false"`, and `aria-controls`.
- [x] Assert the answer region `id` matches the button `aria-controls`.
- [x] Assert the answer region has `hidden` before reveal.
- [x] Assert the answer region is associated with the visible `Answer` label through `aria-labelledby`.
- [x] Do not use raw `queryByText` absence as proof that answer or explanation is hidden, because the hidden answer region stays mounted.
- [x] Click `Show answer` with `userEvent` and assert the button changes to `Hide answer`, `aria-expanded` becomes `true`, `hidden` is removed, and the answer plus explanation are visible.
- [x] Click `Hide answer` and assert the region is collapsed again.
- [x] Render two quizzes on the same page and assert their controls have distinct answer-region ids.
- [x] Assert revealing one quiz does not reveal the other quiz.
- [x] Cover keyboard operability through native button interaction with Testing Library/user-event where practical; do not add custom key handlers unless production code requires them.

## Expected Behavior

- The tests prove the reveal interaction works in the DOM rather than only in static markup.
- Tests verify ARIA state and association through actual attributes.
- Tests treat hidden answer content as mounted but not visible, matching the finalized source-secrecy decision.
- Multiple quizzes are independent in both state and controlled region ids.

## Verification Commands

Install the new dev dependencies before running the new DOM tests:

```bash
npm install
```

```bash
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run typecheck
```

## Cleanup Notes

- This task should not create application data.
- If dependency installation changes `package-lock.json`, keep only the lockfile changes required by the dev dependencies.
- Do not convert unrelated tests to jsdom.
- Do not alter production behavior to satisfy a test if it conflicts with the finalized plan.
