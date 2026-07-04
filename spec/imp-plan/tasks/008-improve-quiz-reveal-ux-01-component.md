# Task: Quiz Reveal Component

## Goal

Convert the `quiz` lecture component from an always-visible answer key into a local client-side reveal toggle while preserving the existing quiz authoring schema and render structure.

## Dependencies

- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`
- Existing quiz rendering and validation behavior from `src/components/lecture-kit/Quiz.tsx` and `src/lib/lecture-template/validateTemplate.ts`.

## Exact Files To Create Or Modify

- `src/components/lecture-kit/Quiz.tsx` - Implement the reveal toggle, hidden answer region, ARIA wiring, and no-JavaScript message.
- `src/components/lecture-kit/SectionRenderer.tsx` - Read to confirm quiz dispatch remains unchanged; modify only if the existing import or dispatch breaks after making `Quiz` a client component.
- `src/lib/lecture-template/types.ts` - Read only; do not change the `QuizComponent` schema.
- `src/lib/lecture-template/validateTemplate.ts` - Read only; do not change quiz validation semantics.

## Checklist

- [x] Add `"use client"` to `Quiz.tsx`.
- [x] Use local `useState(false)` so each quiz starts collapsed and each instance maintains independent reveal state.
- [x] Use React `useId` to create stable unique ids for the answer region and answer label.
- [x] Keep the visible label exactly `Quiz: Knowledge check`.
- [x] Keep the question visible as the strongest content in the quiz card.
- [x] Keep options visible in an ordered list.
- [x] Render a native `<button type="button">` below the options.
- [x] Set button text to `Show answer` when collapsed and `Hide answer` when expanded.
- [x] Set `aria-expanded={revealed}` on the button.
- [x] Set `aria-controls={answerRegionId}` on the button.
- [x] Render the answer region as an always-mounted element with `id={answerRegionId}`, `className="quiz-answer"`, `hidden={!revealed}`, and `aria-labelledby={answerLabelId}`.
- [x] Replace the old `Static answer key` label with `Answer`.
- [x] Render `component.answer` and optional `component.explanation` only inside the answer region.
- [x] Add `<noscript className="quiz-noscript">` inside the quiz with a message that JavaScript is required for interactive reveal and printed output includes the answer and explanation.
- [x] Hide the reveal button in the no-JavaScript fallback so the static page does not show an inert control.
- [x] Do not use `dangerouslySetInnerHTML`.
- [x] Do not add grading, answer selection, persistence, analytics, external services, encryption, or a runtime UI library.
- [x] Do not change `QuizComponent`, parser behavior, or validator rules.

## Expected Behavior

- Initial JavaScript-enabled render visibly shows the quiz label, question, ordered options, and a `Show answer` button.
- Initial JavaScript-enabled render does not visibly show the answer or optional explanation.
- Activating the button reveals an in-place answer region labeled `Answer`, including the answer value and optional explanation.
- Activating the button again hides the same answer region and changes the button back to `Show answer`.
- Multiple quiz instances have independent state and distinct answer-region ids.
- The answer remains present in source/static markup as hidden content; this feature is a pacing aid, not secure assessment.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run typecheck
```

Run these after the related test tasks are implemented:

```bash
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
npm run validate
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify example content, documentation, or test expectations in this task unless a compile failure requires a narrow import/path correction.
- Do not revert unrelated uncommitted work in component, schema, validation, or renderer files.
