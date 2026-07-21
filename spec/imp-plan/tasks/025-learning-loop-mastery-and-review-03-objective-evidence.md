# Task: Implement Pure Objective Evidence

## Goal

Create a browser-independent evidence model that connects normalized explicit
objectives to learner activity without producing grades, percentages, or
permanent mastery claims.

## Dependencies

- `025-learning-loop-mastery-and-review-02-objectives.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/objectiveEvidence.ts` — create.
- `tests/lecture-template/objective-evidence.test.ts` — create.

## Checklist

- [x] Define the pure `LearnerActivityEvidence` input shape used by the model,
  including assessment key, response key, attempted/revealed state, objective
  outcome, self-assessment signal, review record, and due state.
- [x] Resolve activities only through explicit objective IDs and retain source
  lecture, section, and assessment anchors for navigation.
- [x] Distinguish `not_assessed` (no linked activity) from `not_started` (linked
  activity exists but has no learner activity).
- [x] Apply the plan’s precedence: any incorrect, `needs_review`, or due item
  yields `review_recommended`; otherwise incomplete activity yields
  `practicing`; only all completed positive signals yield
  `demonstrated`/“demonstrated recently.”
- [x] Expand a `question_set` into one schedulable activity per question using
  `${assessmentId}:${questionIndex}` while retaining one authored assessment
  summary and aggregating mixed results by the same rules.
- [x] Include objective text, evidence status, and source links only; do not
  expose answer text or grading language.
- [x] Cover unknown references, no-answer self-assessment, correct plus
  unattempted, incorrect plus correct, due-after-positive, multiple linked
  activities, and no-assessment objectives in pure tests.

## Expected Behavior

- Evidence is deterministic for the same normalized objectives, assessment
  summaries, activity evidence, and clock-derived due state.
- A due item recommends review even when its previous learner rating was
  positive.
- The module has no React, `window`, `localStorage`, or runtime network import.

## Verification Commands

```bash
npm run test -- tests/lecture-template/objective-evidence.test.ts
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Keep answer-bearing authored data and learner state out of the pure evidence
  result.
