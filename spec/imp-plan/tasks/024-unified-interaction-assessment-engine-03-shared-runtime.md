# Task: Add Shared Assessment Runtime Primitives

## Goal

Share the common shell, feedback semantics, and objective choice-attempt logic
across current assessment renderers without flattening their unique behavior.

## Dependencies

- `024-unified-interaction-assessment-engine-01-contracts-metadata.md`
- `024-unified-interaction-assessment-engine-02-registry-capabilities.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/assessment/AssessmentShell.tsx` (new)
- `src/components/lecture-kit/assessment/AssessmentFeedback.tsx` (new)
- `src/components/lecture-kit/assessment/useChoiceAssessmentAttempt.ts` (new)
- `src/components/lecture-kit/assessment/useLocalAssessmentLifecycle.ts` (new)
- `src/components/lecture-kit/Quiz.tsx`
- `src/components/lecture-kit/QuestionSet.tsx`
- `src/components/lecture-kit/FreeResponse.tsx`
- `src/components/lecture-kit/PracticeTask.tsx`
- `src/components/lecture-kit/Flashcard.tsx`
- `tests/lecture-template/assessment-interaction.test.tsx`
- `tests/lecture-template/advanced-components-interaction.test.tsx`

## Checklist

- [ ] Implement `AssessmentShell` using existing `Card` primitives and the
  current label/title/anchor conventions, including meaningful no-JavaScript
  fallback content for reveal-capable activities.
- [ ] Implement `AssessmentFeedback` with neutral, correct, and incorrect
  states, accessible status semantics, and no formal grading language.
- [ ] Implement `useChoiceAssessmentAttempt` for selected response, restored
  answer state, reveal state, correctness, and `recordAnswer` calls.
- [ ] Implement local lifecycle states for self-assess, reveal, and rubric
  activities, including `Mark as understood`/`Needs review` behavior without
  persistence.
- [ ] Keep the current `QuestionSet` per-question storage keys and preview-only
  shuffle behavior unchanged.
- [ ] Keep non-choice lifecycle state local to the mounted component; do not
  promise persisted reveal, self-assessment, or practice-draft state.
- [ ] Refactor `Quiz` and `QuestionSet` to use the shared choice hook.
- [ ] Refactor the other current activity components to use the shared shell
  where it does not alter direct-render behavior.
- [ ] Render the normalized flashcard anchor when available, while allowing
  direct fixtures without one.
- [ ] Preserve no-JavaScript helper copy, print behavior, focus behavior, and
  existing visible labels.
- [ ] Keep free-response text local and unsaved.
- [ ] Keep practice-task and flashcard reveal state local to the interaction.

## Expected Behavior

- Quiz and question-set selection/restoration/reveal behavior remains unchanged.
- Existing answer persistence remains `{ selected, correct }` under the current
  storage key.
- All activity cards share the same shell hierarchy and accessible status
  treatment.
- No new runtime dependency or storage namespace is introduced.
- Existing quiz retry behavior and question-set retry behavior remain distinct
  unless the shared hook can preserve both exactly.

## Verification Commands

```bash
npm run test -- tests/lecture-template/assessment-interaction.test.tsx tests/lecture-template/advanced-components-interaction.test.tsx tests/lecture-template/quiz-interaction.test.tsx
npm run typecheck
```

## Cleanup Notes

- Do not introduce a state-management library.
- Do not persist free-response drafts, practice text, or flashcard reveal state.
