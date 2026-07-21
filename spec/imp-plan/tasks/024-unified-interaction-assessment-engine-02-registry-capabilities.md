# Task: Build The Normalized Assessment Registry

## Goal

Make one pure registry describe every current learning activity and its
evaluation capabilities, while preserving the existing answer-key contract.

## Dependencies

- `024-unified-interaction-assessment-engine-01-contracts-metadata.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/assessments.ts`
- `tests/lecture-template/collection.test.ts`
- `tests/lecture-template/assessment-hierarchy.test.tsx`

## Checklist

- [ ] Extend the activity type union to include `flashcard`.
- [ ] Use one canonical `AssessmentKind` union and one exhaustive capability map;
  keep `AssessmentSummary.type` as the compatibility property.
- [ ] Add evaluation modes: `choice`, `self_assess`, `reveal`, and `rubric`.
- [ ] Add capability metadata for answer review and answer-key eligibility.
- [ ] Map current activities as follows: quiz/question_set → choice;
  free_response → self_assess; practice_task → rubric; flashcard → reveal.
- [ ] Extend `AssessmentSummary` with stable ID, evaluation mode, capability
  flags, optional objective references, and learner-safe response items with
  deterministic attempt keys.
- [ ] Include flashcards in `collectLectureAssessments` and collection
  assessment indexes.
- [ ] Keep `collectLectureAnswerKey` restricted to current answer-key-capable
  activities; do not add flashcards to the answer-key appendix in this task.
- [ ] Export pure capability lookup helpers so components do not duplicate type
  switches.
- [ ] Keep answer text and learner attempt state out of summaries.
- [ ] Keep one canonical `type` vocabulary and capability map; do not introduce
  a conflicting `kind`/`referenceOnly` model.
- [ ] Build response items for quiz and question-set entries without copying
  answer text into the summary.
- [ ] Preserve source order and valid-lecture filtering.

## Expected Behavior

- The component demo produces summaries in source order including flashcards.
- Flashcard summaries are labelled as reveal activities and are not reported as
  correct, incorrect, missed, or unattempted.
- Existing answer-key tests continue to pass for quiz, question set, free
  response, and practice task.

## Verification Commands

```bash
npm run test -- tests/lecture-template/collection.test.ts tests/lecture-template/assessment-hierarchy.test.tsx
npm run typecheck
```

## Cleanup Notes

- Update expected assessment counts only where the new flashcard index behavior
  is intentional.
- Do not add a second persistence key or browser API to the registry.
