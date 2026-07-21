# Task: Add Collection Learning Loop Aggregation

## Goal

Aggregate review queue and objective evidence across valid lectures while
preserving lecture-local identity, authored order, route anchors, and invalid
lecture diagnostics.

## Dependencies

- `025-learning-loop-mastery-and-review-05-review-state-adapters.md`
- `025-learning-loop-mastery-and-review-07-single-lecture-ux.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/collection.ts`
- `src/components/lecture-kit/progress/CollectionReviewProvider.tsx` — create.
- `src/components/lecture-kit/CollectionLanding.tsx`
- `src/components/lecture-kit/progress/CollectionProgressProvider.tsx`
- `src/components/lecture-kit/ReviewQueue.tsx`
- `src/components/lecture-kit/LearnerDashboardSummary.tsx`
- `src/app/lectures/[slug]/page.tsx`
- `tests/lecture-template/collection-review-provider.test.tsx` — create.
- `tests/lecture-template/collection-progress-integration.test.tsx`
- `tests/lecture-template/collection-landing-anchor.test.tsx`
- `tests/lecture-template/assessment-index-disclosure.test.tsx`
- `tests/lecture-template/collection-lecture-navigation.test.tsx`

## Checklist

- [x] Add a collection review registry with `{ slug, lectureId, order,
  objectives, assessments }`, deriving `lectureId` through the existing
  progress ID helper.
- [x] Build the registry only from valid lecture templates and preserve the
  collection’s authored order; exclude invalid lectures from learner queues.
- [x] Read each lecture’s namespaced review key through the composed collection
  review provider or equivalent snapshot aggregator without merging identical
  objective IDs across lectures.
- [x] Integrate collection summary counts for continue/resume, section
  progress, due items, and review recommendations while keeping the existing
  course map as the detailed navigation surface.
- [x] Group collection queue items by lecture, preserve authored order within a
  lecture, and link to the correct lecture route plus assessment anchor.
- [x] Keep same-objective/different-lecture evidence separate and preserve
  route-specific navigation on `/lectures/[slug]`.
- [x] Refresh due state on mount, `visibilitychange`, window focus, and a
  bounded mounted-queue interval; keep the due predicate injectable in tests.
- [x] Preserve the existing collection progress key and invalid-lecture
  validation behavior.

## Expected Behavior

- The collection landing page immediately communicates whether to continue or
  review, with a clear empty state for a new learner.
- Due items and objective evidence are lecture-scoped, ordered, and linked to
  authored source assessments; no invalid lecture contributes learner content.

## Verification Commands

```bash
npm run test -- tests/lecture-template/collection-review-provider.test.tsx tests/lecture-template/collection-progress-integration.test.tsx tests/lecture-template/collection-landing-anchor.test.tsx tests/lecture-template/assessment-index-disclosure.test.tsx tests/lecture-template/collection-lecture-navigation.test.tsx
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not modify existing collection lecture templates or raw course evidence
  to make aggregation tests pass.
