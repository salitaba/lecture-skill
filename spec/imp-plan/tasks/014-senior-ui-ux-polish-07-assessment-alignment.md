# Task 07: Align Assessment Index and Assessment Component Hierarchy

## Goal

Rework collection assessment index and align visual hierarchy across assessment components.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Modify**: `src/components/lecture-kit/QuestionSet.tsx`
- **Modify**: `src/components/lecture-kit/FreeResponse.tsx`
- **Modify**: `src/components/lecture-kit/PracticeTask.tsx`
- **Modify**: `tests/lecture-template/assessment-interaction.test.tsx`
- **Create**: `tests/lecture-template/assessment-hierarchy.test.tsx` (new test file)

## Checklist

- [ ] Rework collection assessment index to group by lecture first
- [ ] Shorten long labels in UI while preserving full destination via accessible name/title
- [ ] Move assessment index below lecture list or inside disclosure
- [ ] Align visual hierarchy across Quiz, QuestionSet, FreeResponse, PracticeTask:
  - Prompt/task first
  - Learner input or selection second
  - Reveal/compare action third
  - Answer/guidance/solution/feedback last
- [ ] Avoid language implying remote submission or formal grading
- [ ] Keep answer key appendix and hidden assessment feedback visible in print
- [ ] Add tests verifying hierarchy and grouping

## Expected Behavior

Assessment components should:
1. Have consistent visual hierarchy (prompt → input → action → feedback)
2. Assessment index grouped by lecture
3. Long labels shortened but still accessible
4. No submission/grading language
5. Print-friendly output

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/assessment-hierarchy.test.tsx
npm run test -- tests/lecture-template/assessment-interaction.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure no formal grading language is introduced
