# Task: Build Single-Lecture Learning Loop UX

## Goal

Expose a compact lecture-level summary, objective evidence map, and review
queue near the existing assessment index without changing authored navigation
or the quiet-reading hierarchy.

## Dependencies

- `025-learning-loop-mastery-and-review-03-objective-evidence.md`
- `025-learning-loop-mastery-and-review-05-review-state-adapters.md`
- `025-learning-loop-mastery-and-review-06-assessment-retry.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/LearnerDashboardSummary.tsx` — create.
- `src/components/lecture-kit/ObjectiveEvidenceMap.tsx` — create.
- `src/components/lecture-kit/ReviewQueue.tsx` — create.
- `src/components/lecture-kit/LecturePage.tsx`
- `src/app/globals.css`
- `tests/lecture-template/learner-dashboard.test.tsx` — create.
- `tests/lecture-template/objective-evidence-map.test.tsx` — create.
- `tests/lecture-template/review-queue.test.tsx` — create.
- `tests/lecture-template/lecture-components.test.tsx`
- `tests/lecture-template/assessment-interaction.test.tsx`

## Checklist

- [x] Mount the single-lecture review provider with the current lecture ID and
  assessment registry, keeping the authored overview, objectives, sections,
  takeaways, and assessment index in their existing order.
- [x] Add the summary near the assessment index with continue/resume action,
  section progress, due-review count, review-recommendation count, and a clear
  new-learner empty state.
- [x] Render objective text, evidence language, source assessment/section
  links, and “demonstrated recently” wording without scores, grades, or
  definitive “mastered” claims.
- [x] Render due items in authored order with title, lecture/section context,
  objective labels, due state, and an anchor link to the original assessment.
- [x] Add the empty queue state and link it to the next authored learning
  action; use a neutral state until local review data has hydrated.
- [x] Preserve no-JavaScript authored content and add live-region announcements,
  focus management, keyboard operation, reduced-motion behavior, mobile
  wrapping, dark-mode readability, and accessible status text.
- [x] Reuse existing `Card`, `Button`, `Disclosure`, and `ProgressMeter`
  primitives and avoid duplicating answer-bearing assessment markup.

## Expected Behavior

- A learner opening one lecture can see what to continue or review without the
  lecture becoming a dashboard or changing authored section order.
- New, hydrating, due, complete, and unavailable-storage states are neutral,
  understandable, and usable with keyboard and screen-reader navigation.

## Verification Commands

```bash
npm run test -- tests/lecture-template/learner-dashboard.test.tsx tests/lecture-template/objective-evidence-map.test.tsx tests/lecture-template/review-queue.test.tsx tests/lecture-template/lecture-components.test.tsx tests/lecture-template/assessment-interaction.test.tsx
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not use learner state to rewrite or hide authored lecture content.
