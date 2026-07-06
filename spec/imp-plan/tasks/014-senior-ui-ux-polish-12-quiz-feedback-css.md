# Task 12: Add CSS for Quiz Feedback States

## Goal

Add CSS styles for quiz selected/correct/incorrect feedback states.

## Files to Create/Modify

- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/quiz-feedback-styles.test.tsx` (new test file)

## Checklist

- [ ] Add CSS for quiz option selected state
- [ ] Add CSS for correct feedback state
- [ ] Add CSS for not-quite feedback state
- [ ] Ensure quiz feedback is visually distinct
- [ ] Preserve print rules for quiz answers
- [ ] Add tests verifying quiz feedback styles exist

## Expected Behavior

Quiz feedback should:
1. Have clear visual distinction for selected state
2. Show correct/not-quite feedback with appropriate styling
3. Maintain print compatibility
4. Be accessible and readable

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/quiz-feedback-styles.test.tsx
npm run build
```

## Cleanup Notes

- No data cleanup required
- Ensure no decorative redesign beyond spec guidance
