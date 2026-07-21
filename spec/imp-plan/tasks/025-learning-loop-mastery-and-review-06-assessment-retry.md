# Task: Add Assessment Review Controls And Choice Retry

## Goal

Extend the existing assessment lifecycle with explicit review ratings and a
choice retry flow while preserving current answer-attempt persistence and
answer-review behavior.

## Dependencies

- `025-learning-loop-mastery-and-review-02-objectives.md`
- `025-learning-loop-mastery-and-review-05-review-state-adapters.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/AssessmentReviewControls.tsx` — create.
- `src/components/lecture-kit/SectionRenderer.tsx`
- `src/components/lecture-kit/Quiz.tsx`
- `src/components/lecture-kit/QuestionSet.tsx`
- `src/components/lecture-kit/Flashcard.tsx`
- `src/components/lecture-kit/FreeResponse.tsx`
- `src/components/lecture-kit/PracticeTask.tsx`
- `src/components/lecture-kit/assessment/AssessmentShell.tsx`
- `tests/lecture-template/assessment-retry.test.tsx` — create.
- `tests/lecture-template/quiz-interaction.test.tsx`
- `tests/lecture-template/assessment-interaction.test.tsx`
- `tests/lecture-template/answer-review-disclosure.test.tsx`
- `tests/lecture-template/progress-provider.test.tsx`

## Checklist

- [x] Thread the stable assessment ID and DOM anchor through `RenderBlocks`,
  `Quiz`, `QuestionSet`, and `AssessmentShell`; keep authored anchors intact.
- [x] Add shared review controls for choice, reveal, self-assessment, and
  rubric activities only where their evaluation mode supports a learner
  judgment.
- [x] Implement the explicit `retry()` contract that clears only the mounted
  choice lock; do not clear unrelated progress, annotations, or review state.
- [x] Preserve the current answer-attempt key/schema and replace the existing
  latest attempt on the next check rather than creating history.
- [x] Enforce event order: retry, check, then rating. A retry alone must not
  create an attempt or mutate the schedule; abandoning a retry keeps the prior
  schedule.
- [x] Add accessible labels/status announcements and preserve the existing
  no-JavaScript fallback, `AnswerReviewDisclosure`, `AnswerKeyAppendix`, and
  `singleLectureAnswersKey()` contracts.
- [x] Test correct, incorrect, restored, retried, abandoned, question-set, and
  no-history cases across the existing interaction surfaces.

## Expected Behavior

- A learner can retry a restored choice assessment explicitly, then record a
  review judgment after checking it.
- Existing answer review still reports the latest persisted answer attempt, and
  retry does not create an attempt history in this feature.
- Reveal/self-assessment/rubric controls never persist answer text or drafts.

## Verification Commands

```bash
npm run test -- tests/lecture-template/assessment-retry.test.tsx tests/lecture-template/quiz-interaction.test.tsx tests/lecture-template/assessment-interaction.test.tsx tests/lecture-template/answer-review-disclosure.test.tsx tests/lecture-template/progress-provider.test.tsx
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not change authored assessment IDs, existing anchors, or answer-key
  content as part of interaction work.
