# Task: Align Assessment Review And Index Surfaces

## Goal

Make learner review and collection navigation consume capability metadata from
the registry instead of hard-coded component-name checks.

## Dependencies

- `024-unified-interaction-assessment-engine-02-registry-capabilities.md`
- `024-unified-interaction-assessment-engine-03-shared-runtime.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/AnswerReviewDisclosure.tsx`
- `src/components/lecture-kit/AssessmentIndexDisclosure.tsx`
- `src/components/lecture-kit/LecturePage.tsx`
- `src/components/lecture-kit/AnswerKeyAppendix.tsx` only if capability typing
  requires a narrow answer-key union.
- `src/components/lecture-kit/CollectionLanding.tsx` only if the registry
  output contract requires an additive prop change.
- `tests/lecture-template/assessment-hierarchy.test.tsx`
- `tests/lecture-template/collection.test.ts`
- `tests/lecture-template/answer-review-disclosure.test.tsx` if present or a
  focused existing test file.

## Checklist

- [ ] Filter answer review using `supportsAnswerReview`, preserving the current
  missed/unattempted behavior for quiz and question-set items. Consume registry
  response items rather than answer-key payloads.
- [ ] Wait for `answersLoaded`, then show unattempted objective items even when
  no attempts exist; remain absent before load or without a provider.
- [ ] Ensure flashcards never appear in incorrect-answer review.
- [ ] Add a neutral flashcard/reveal label to the activity index.
- [ ] Ensure every indexed activity links to its normalized anchor.
- [ ] Add explicit single-lecture versus collection link behavior and render a
  per-lecture index on `LecturePage`.
- [ ] Preserve source order, lecture grouping, truncation, disclosure behavior,
  and mobile hierarchy.
- [ ] Keep answer-key rendering restricted to answer-key-capable entries.
- [ ] Surface objective references only as additive reviewer-friendly metadata;
  do not add scores or mastery UI.
- [ ] Preserve invalid-lecture filtering and single-lecture behavior.

## Expected Behavior

- The collection index includes quiz, question set, free response, practice
  task, and flashcard activities.
- Only objective choice activities appear in personal incorrect/unattempted
  review.
- The answer key remains a complete reference for existing answer-key types and
  does not imply that flashcard reveal is grading.

## Verification Commands

```bash
npm run test -- tests/lecture-template/assessment-hierarchy.test.tsx tests/lecture-template/collection.test.ts
```

## Cleanup Notes

- If the named answer-review test file does not exist, use the nearest focused
  test file and record that substitution in the implementation report.
- Do not add a learner score, percentage, or mastery summary.
