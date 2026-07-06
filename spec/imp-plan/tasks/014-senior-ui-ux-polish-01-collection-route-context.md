# Task 01: Verify/Update Collection Lecture Route with Collection Context

## Goal

Verify the existing collection lecture route at `src/app/lectures/[slug]/page.tsx` and update it to provide collection context (previous/next navigation targets, static params, etc.) as required by the implementation plan.

## Files to Create/Modify

- **Modify**: `src/app/lectures/[slug]/page.tsx`
- **Create**: `tests/lecture-template/collection-route-context.test.tsx` (new test file)

## Checklist

- [ ] Verify existing route structure and ensure it passes collection context to `LecturePage`
- [ ] Add collection navigation context: previous/next lecture targets, back href, back label
- [ ] Ensure `generateStaticParams()` returns slugs from collection entries
- [ ] Ensure missing slugs return `notFound()`
- [ ] Ensure invalid lectures render `ValidationScreen`
- [ ] Ensure valid lectures render `LecturePage` with collection navigation props
- [ ] Add tests verifying:
  - Collection mode renders landing at `/`
  - Collection lecture pages render by slug
  - First lecture has next but no previous
  - Middle lecture has both previous and next
  - Last lecture has previous but no next
  - Back link targets course landing
  - Missing slug returns notFound
  - Static params follow authored order

## Expected Behavior

The collection lecture route should:
1. Derive ordered lecture entries from `lectures/` using `scanLectureCollection()`
2. For each requested slug:
   - Return `notFound()` for missing slugs
   - Validate the selected lecture source
   - Render `ValidationScreen` for invalid lecture templates
   - Render `LecturePage` for valid lectures with collection context
3. Compute previous and next lectures from authored collection order
4. Pass collection context into `LecturePage` including:
   - Current slug
   - Template path
   - Previous/next navigation targets
   - Collection storage key
   - Optional course title for "Back to course" label
5. Keep `src/app/page.tsx` single-lecture behavior unchanged when `lectures/` is absent

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/collection-route-context.test.tsx
npm run test -- tests/lecture-template/backward-compat.test.tsx
```

## Cleanup Notes

- No data cleanup required for tests
- Ensure test fixtures use existing multi-lecture examples from `examples/multi-lecture/`
