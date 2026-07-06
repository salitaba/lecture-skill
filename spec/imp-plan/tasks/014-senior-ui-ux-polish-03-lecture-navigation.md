# Task 03: Render Lecture-to-Lecture Navigation in Collection Mode

## Goal

Update `LecturePage` to accept and render lecture-to-lecture navigation when in collection mode.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/LecturePage.tsx`
- **Modify**: `src/components/lecture-kit/LectureNavigation.tsx`
- **Create**: `tests/lecture-template/collection-lecture-navigation.test.tsx` (new test file)

## Checklist

- [ ] Update `LecturePage` props to accept optional `collectionNavigation` with:
  - `previous?: NavTarget`
  - `next?: NavTarget`
  - `backHref: string`
  - `backLabel?: string`
- [ ] Render compact top affordance when collection context exists (below header/progress)
- [ ] Render full `LectureNavigation` after takeaways and answer key
- [ ] Update `LectureNavigation` to accept optional `backHref` and `backLabel` instead of hard-coded values
- [ ] Keep links as normal anchors for no-JS and review-package compatibility
- [ ] Add tests for first, middle, and last lecture navigation states
- [ ] Ensure back link targets course landing page

## Expected Behavior

When in collection mode, lecture pages should:
1. Show a compact top navigation row (back to course + next lecture)
2. Show full previous/back/next navigation at bottom
3. First lecture: back to course + next lecture
4. Middle lecture: previous + back to course + next
5. Last lecture: previous + back to course
6. Back link uses configurable href (default `/`) and label (default "Back to course")
7. All links are normal anchors (`<a>` tags)

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/collection-lecture-navigation.test.tsx
npm run test -- tests/lecture-template/lecture-navigation.test.tsx
npm run test -- tests/lecture-template/backward-compat.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure tests verify no-JS compatibility (normal anchor links)
