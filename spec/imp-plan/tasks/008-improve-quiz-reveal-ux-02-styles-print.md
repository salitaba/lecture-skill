# Task: Quiz Reveal Styles And Print

## Goal

Update quiz styling so collapsed and revealed states are readable on screen, keyboard focus remains visible, long content wraps cleanly, no-JavaScript messaging is clear, and print output always includes answers.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md` should define the final class names and markup shape.
- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`

## Exact Files To Create Or Modify

- `src/app/globals.css` - Add styles for `.quiz-reveal-button`, `.quiz-noscript`, hidden/revealed `.quiz-answer`, responsive wrapping, and print behavior.
- `src/components/lecture-kit/Quiz.tsx` - Read only to confirm class names; modify only if class names need to align with the component task.

## Checklist

- [x] Keep `.quiz-card`, `.quiz-question`, and `.quiz-options` readable with current visual hierarchy.
- [x] Add `.quiz-reveal-button` styles with a clear button affordance and no layout overlap.
- [x] Confirm the existing global `button:focus-visible` rule remains visible on the reveal button; strengthen focus styling only if the new button styles weaken it.
- [x] Add `.quiz-noscript` styling that is readable but visually secondary.
- [x] Keep `.quiz-answer` visually distinct when visible.
- [x] Ensure `[hidden]` answer content creates no empty visual gap on screen.
- [x] Ensure long questions, options, answers, and explanations wrap at phone, tablet, and desktop widths.
- [x] Avoid body-level horizontal overflow from long quiz content.
- [x] Avoid transitions unless they respect `prefers-reduced-motion`.
- [x] In `@media print`, hide `.quiz-reveal-button`.
- [x] In `@media print`, hide `.quiz-noscript`.
- [x] In `@media print`, force collapsed answers to print with `.quiz-answer[hidden] { display: block !important; }`.
- [x] Keep printed answer and explanation labels clear and independent of reveal state.
- [x] Preserve existing print `break-inside` and border behavior for quiz cards and answer regions where possible.

## Expected Behavior

- On screen, collapsed quizzes show no answer region space until the learner reveals the answer.
- The reveal button is visibly interactive, keyboard focus is obvious, and text wraps inside the quiz card at narrow and wide widths.
- Print output includes the answer and optional explanation even if the quiz was collapsed on screen.
- Print output does not show the reveal button or no-JavaScript fallback message.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run lint
npm run typecheck
```

Manual CSS checks after implementation:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Check the expression at approximately 390px, 768px, and 1280px viewport widths while rendering the component demo.

## Cleanup Notes

- If manual review requires temporarily copying `examples/component-demo.template.md` to `content/lecture.template.md`, save and restore the original `content/lecture.template.md`.
- This task should not create persistent test data.
- Do not revert unrelated edits in `src/app/globals.css`.
