# Task: Implement The Pure Review Scheduler

## Goal

Implement the bounded, deterministic local review scheduler and due/queue
helpers before connecting storage or UI.

## Dependencies

- `025-learning-loop-mastery-and-review-01-fixtures.md` for scheduler state
  cases.

## Exact Files To Create Or Modify

- `src/lib/lecture-template/reviewSchedule.ts` — create.
- `tests/lecture-template/review-schedule.test.ts` — create.

## Checklist

- [x] Define review ratings, persisted review state, activity keys, and
  `learning`/`review` status semantics; derive due state from `dueAt`.
- [x] Implement the default bounded interval sequence `0, 1, 3, 7, 14, 30`.
- [x] Implement the exact transition table: `again` resets to zero,
  `hard` uses `ceil(previous * 1.5)` with a minimum of one, `good` advances
  to the next sequence interval, and `easy` advances one additional sequence
  step capped at 30 days.
- [x] Accept an injected valid ISO `now`; throw the documented `RangeError` for
  invalid clock input.
- [x] Clamp clock-rollback transitions to the later of `now` and
  `lastReviewedAt`, while keeping `isDue(record, now)` false until `dueAt`.
- [x] Expose deterministic due-state and authored-order queue helpers without
  storage or UI imports.
- [x] Test new and existing records, every rating, zero intervals, exact ISO
  date arithmetic, the 30-day cap, invalid clocks, and rollback behavior.

## Expected Behavior

- The same prior state, rating, and injected clock always produce the same
  next state and ISO due timestamp.
- `status` is `learning` only when repetitions are zero; all positive-review
  transitions use `review`.
- The scheduler does not create records for unattempted assessments by itself.

## Verification Commands

```bash
npm run test -- tests/lecture-template/review-schedule.test.ts
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Keep this task browser-independent; do not add storage calls, timers, or
  React components.
