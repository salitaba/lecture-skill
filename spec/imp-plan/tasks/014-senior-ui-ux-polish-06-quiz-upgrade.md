# Task 06: Upgrade Quiz from Reveal-Only to Selectable Practice

## Goal

Enhance quiz interaction to support option selection before answer reveal with correctness feedback.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/Quiz.tsx`
- **Modify**: `tests/lecture-template/quiz-interaction.test.tsx`
- **Modify**: `src/app/globals.css`

## Checklist

- [ ] Add local selected-option state
- [ ] Render options as radio group or button list with clear selected state
- [ ] Before reveal:
  - Learner can select one option
  - Selected option visually marked and announced
  - Button text: "Check answer" when selection exists, "Show answer" when no selection
- [ ] After reveal:
  - Show expected answer
  - Compare selected option to `component.answer`
  - Show "Correct" or "Not quite" feedback without formal grading language
  - Include `component.explanation` when present
  - If no selection, reveal answer/explanation without scolding
- [ ] Keep hidden answer/feedback for print and no-JS
- [ ] Do not persist quiz state or add scoring/analytics
- [ ] Update jsdom tests for:
  - Selection behavior
  - Check/reveal behavior
  - Selected state visibility
  - Correct/not-quite feedback messaging
  - No-selection reveal
  - Multiple independent quizzes
  - Keyboard operation
  - Print/no-JS markup

## Expected Behavior

Quiz interaction should:
1. Allow selecting one option before reveal
2. Show clear visual feedback for selected state
3. Change button to "Check answer" when option selected
4. After reveal:
   - Show correct answer
   - Compare selection to answer
   - Provide teaching feedback (not just "correct"/"incorrect")
5. Work without selection (reveal answer normally)
6. Maintain print and no-JS compatibility

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure no scoring/grading language is introduced
