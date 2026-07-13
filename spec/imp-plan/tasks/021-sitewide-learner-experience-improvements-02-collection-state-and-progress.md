# Task 02: Clarify Collection States, Reviewer Status, and Progress Hydration

## Goal

Make collection progress truthful during hydration and concise after loading, while moving invalid-lecture validation details into a clearly labelled author/reviewer disclosure. Keep learner lecture cards focused on sequence, title, description, facts, and meaningful state.

## Dependencies

- Complete `021-sitewide-learner-experience-improvements-01-shared-facts.md` first so collection facts and lecture metadata use the shared layout.
- Preserve `CollectionProgressProvider` persistence, storage keys, and progress model; consume its existing `loaded` and `storageAvailable` state rather than changing the provider contract.

## Exact Files to Create or Modify

- **Create**: `src/components/lecture-kit/CollectionReviewStatus.tsx`
- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Modify**: `src/components/lecture-kit/LectureList.tsx`
- **Modify**: `src/components/lecture-kit/progress/CollectionProgressBar.tsx`
- **Modify**: `src/app/globals.css`
- **Modify**: `tests/lecture-template/collection-progress-integration.test.tsx`
- **Modify**: `tests/lecture-template/lecture-list-state.test.tsx`
- **Modify**: `tests/lecture-template/collection-route-context.test.tsx`

## Checklist

- [x] Add `CollectionReviewStatus` as a quiet native disclosure rendered after learner-facing collection content only when validation results contain invalid lectures.
- [x] Give the disclosure a stable id and list each invalid title/slug with concise actionable validation messages.
- [x] Update invalid lecture cards to use author/reviewer language and link to the review disclosure; do not present fake learner progress for invalid lectures.
- [x] Keep the learner lecture-card order scan-first: title/sequence, state badge, description, variable facts, then progress only when it conveys useful information.
- [x] Treat `useCollectionProgress().loaded === false` as an explicit loading state in both course-level and per-lecture progress UI. Keep the region mounted/stable but do not show `0 of N`, “Not started,” a zero percentage, or an empty mini meter before hydration resolves.
- [x] For confirmed not-started lectures, omit the mini meter; for in-progress lectures, show numeric progress and a mini meter; for completed lectures, show concise completion state and only retain a 100% meter when it adds accessible information.
- [x] Keep existing resume-target calculation and “Resume here” behavior, but do not mark a first unstarted lecture as a resume target before progress is loaded.
- [x] Give course progress explicit loaded/loading, not-saved/session-only, zero, in-progress, and complete copy that does not rely on color. Render progressbar ARIA values only when progress is known.
- [x] Keep “Start course” behavior intact while loading and preserve all existing localStorage/reset semantics.
- [x] Add focused tests for pre-hydration output, loaded not-started/in-progress/completed states, storage-unavailable copy, invalid-card review links, and resume-state behavior.

## Expected Behavior

- Before collection storage hydration, a learner sees a stable progress region with loading status and no false zero or not-started labels.
- After hydration, empty, active, complete, and session-only progress states are distinguishable in text and accessible markup.
- An 11-lecture collection does not repeat an empty progress meter and “0 of N” for every untouched lecture.
- Validation failures remain available to educators/reviewers without competing with the learner-facing course hierarchy, and invalid cards do not claim progress.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/collection-progress-integration.test.tsx tests/lecture-template/lecture-list-state.test.tsx tests/lecture-template/collection-route-context.test.tsx
npm run typecheck
```

## Cleanup Notes

- Tests that seed collection progress must clear the collection progress localStorage key between cases and restore storage mocks.
- Do not alter collection progress serialization, lecture progress keys, debounce timings, reset semantics, or validation contracts.
- Do not add a second reviewer route or analytics event; the disclosure is local presentation only.
