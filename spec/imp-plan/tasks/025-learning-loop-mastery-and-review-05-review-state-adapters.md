# Task: Add Local Review State And Activity Adapters

## Goal

Persist only validated review scheduler metadata in lecture-local browser
storage, expose hydration-safe review state, and adapt existing assessment
lifecycle data into the pure evidence model.

## Dependencies

- `025-learning-loop-mastery-and-review-02-objectives.md`
- `025-learning-loop-mastery-and-review-03-objective-evidence.md`
- `025-learning-loop-mastery-and-review-04-review-scheduler.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/reviewState.ts` — create.
- `src/lib/lecture-template/learnerActivityEvidence.ts` — create.
- `src/lib/lecture-template/progress.ts`
- `src/components/lecture-kit/progress/ReviewProvider.tsx` — create.
- `src/lib/lecture-template/objectiveEvidence.ts`
- `tests/lecture-template/review-state.test.ts` — create.
- `tests/lecture-template/review-provider.test.tsx` — create.
- `tests/lecture-template/progress-model.test.ts`
- `tests/lecture-template/progress-provider.test.tsx`

## Checklist

- [x] Add the namespaced key `lecture-progress:{lectureId}:reviews` without
  changing existing section-progress, answer-attempt, or annotation keys.
- [x] Validate and prune unknown activity IDs, stale assessment IDs, malformed
  records, invalid dates, and corrupted JSON before exposing runtime state.
- [x] Implement a client review provider with loaded and storage-available
  states, debounced best-effort writes, in-memory actions when storage is
  unavailable, and a separate review reset action.
- [x] Keep review loading independent from answer loading so hydration never
  invents a due count before local data is ready.
- [x] Adapt choice, reveal, self-assessment, rubric, and question-set activity
  state into `LearnerActivityEvidence`; create one schedulable key per
  question-set response and persist only scheduler metadata for non-choice
  activities.
- [x] Exclude free-response text, drafts, hidden answers, and full mounted
  lifecycle state from persisted review records.
- [x] Verify `singleLectureAnswersKey()`, answer-review behavior, and section
  `resetProgress()` remain unchanged while review reset is separate.
- [x] Test remount/reload persistence, stale-state pruning, corrupted-state
  recovery, storage failures, hydration state, and reset behavior.

## Expected Behavior

- Review state is private to the current browser and lecture ID.
- Unknown or malformed state is safely ignored without breaking rendering.
- A storage failure disables persistence but does not disable review actions for
  the current session.
- No review record is auto-created for an assessment the learner never used.

## Verification Commands

```bash
npm run test -- tests/lecture-template/review-state.test.ts tests/lecture-template/review-provider.test.tsx tests/lecture-template/progress-model.test.ts tests/lecture-template/progress-provider.test.tsx
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not serialize learner review state into authored templates, validation
  fixtures, logs, static exports, or review-package files.
