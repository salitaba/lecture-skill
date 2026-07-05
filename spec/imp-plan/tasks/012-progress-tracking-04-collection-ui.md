# Task: Add Collection Progress Indicators

## Goal

Display overall course progress and per-lecture completion status on the collection landing page using the collection localStorage schema.

## Dependencies

- `012-progress-tracking-01-model-storage.md`
- `012-progress-tracking-02-provider.md`
- `012-progress-tracking-03-lecture-ui.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/CollectionLanding.tsx` - Render course and lecture progress summaries.
- `src/components/lecture-kit/progress/CollectionProgressProvider.tsx` - New provider or wrapper if the main provider is lecture-only.
- `src/components/lecture-kit/progress/CollectionProgressBar.tsx` - Optional display component for course and mini bars.
- `tests/lecture-template/collection.test.ts` - Aggregation behavior if pure helpers fit here.
- `tests/lecture-template/lecture-components.test.tsx` - Static collection landing markup coverage.

## Checklist

- [x] Build collection progress input from `validation.results`, using valid lectures with `result.template` for section totals.
- [x] Read and validate `lecture-progress:collection:{collectionId}` after mount.
- [x] Render an overall collection progress bar and percent in the collection header.
- [x] Render each valid lecture row with title, percentage, `X of Y sections`, and a mini progress indicator.
- [x] Keep invalid lecture rows visible with validation status and no misleading progress total.
- [x] Handle empty valid-lecture collections and zero-section lectures without divide-by-zero.
- [x] Do not assume a concrete `src/app/lectures/[slug]/page.tsx` route exists in this checkout.
- [x] Add tests for partial, complete, unstarted, invalid, and empty collection states.

## Expected Behavior

The collection landing page summarizes locally stored progress across valid lectures and shows compact per-lecture completion status without syncing or exporting data.

## Verification Commands

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

Clear jsdom localStorage between collection rendering tests. Do not create collection fixture files unless inline fixtures become too large to maintain.
