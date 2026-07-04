# Task: Wire Rendering, Anchored Quiz, Assessment Index, And Answer Key

## Goal

Dispatch all assessment components in the lecture renderer, add assessment ids to legacy quiz cards, render a printable answer-key appendix, and add the course-level assessment index.

## Dependencies

- `011-stronger-assessments-04-assessment-collector.md`
- `011-stronger-assessments-05-question-set-component.md`
- `011-stronger-assessments-06-free-response-component.md`
- `011-stronger-assessments-07-practice-task-component.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/SectionRenderer.tsx` - Import and dispatch `QuestionSet`, `FreeResponse`, and `PracticeTask`.
- `src/components/lecture-kit/Quiz.tsx` - Render `id={component.anchor}` without changing quiz schema or reveal behavior.
- `src/components/lecture-kit/AnswerKeyAppendix.tsx` - New appendix component built from assessment collector output.
- `src/components/lecture-kit/LecturePage.tsx` - Render answer-key appendix immediately after Key Takeaways.
- `src/components/lecture-kit/CollectionLanding.tsx` - Render course-level assessment index before the lecture list.
- `tests/lecture-template/lecture-components.test.tsx` - Add dispatch, quiz id, answer-key appendix, and assessment index static markup coverage.
- `tests/lecture-template/collection.test.ts` - Add collection assessment index data coverage where helper output is tested.

## Checklist

- [x] Update `SectionRenderer` switch cases for `question_set`, `free_response`, and `practice_task`.
- [x] Add `id={component.anchor}` to `Quiz` while preserving its visible label, reveal copy, option list, answer region, and no-script behavior.
- [x] Add `AnswerKeyAppendix.tsx` with an `answer-key-appendix` class and clear review/print wording.
- [x] Render the answer-key appendix after Key Takeaways in `LecturePage`.
- [x] Implement the appendix as a screen-visible `<details>` disclosure that CSS can force open/visible in print.
- [x] Include answer-key entries for `quiz`, `question_set`, `free_response`, and `practice_task`.
- [x] Add a course-level assessment index in `CollectionLanding` before the lecture list.
- [x] Make the index use only valid lecture results and link items to `/lectures/<slug>#<assessment-anchor>`.
- [x] Show a compact empty state when no valid lecture has assessments.
- [x] Do not add a mandatory single-lecture assessment index unless the helper makes it trivial; in-page anchors and answer-key appendix satisfy P0 for single lecture.

## Expected Behavior

- All four assessment types render through `SectionRenderer`.
- Existing quiz interactions remain unchanged while quiz cards gain fragment targets.
- A lecture page contains a printable answer-key appendix with all guidance/answers.
- A collection landing page lists assessment links across valid lectures only.

## Verification Commands

```bash
npm run typecheck
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/quiz-interaction.test.tsx
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify review-package rewriting in this task unless rendering tests expose a link contract that package tests should cover later.
