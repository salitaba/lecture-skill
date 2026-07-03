# Task: Root Page Collection Mode Integration

**Goal**: Update the root page to detect collection mode and render the landing page or single-lecture view accordingly.

**Dependencies**: Tasks 1, 2, 4 (collection types, LecturePage extraction, landing page component)

## Files to Create/Modify

- `src/app/page.tsx` — Add collection-mode detection

## Checklist

### page.tsx updates
- [ ] Import `isCollectionMode` and `validateCollection` from `@/lib/lecture-template/collection`
- [ ] Import `CollectionLanding` from `@/components/lecture-kit/CollectionLanding`
- [ ] Import `LecturePage` from `@/components/lecture-kit/LecturePage`
- [ ] At the top of `Home()`: call `await isCollectionMode()`
- [ ] If collection mode: call `await validateCollection()`, render `<CollectionLanding validation={validation} />` inside `<PageShell>`
- [ ] If single-lecture mode: keep existing behavior unchanged (read template, validate, render `LecturePage` or `ValidationScreen`)
- [ ] Remove direct imports of components now handled by `LecturePage` (LectureHeader, SectionNavigation, SectionRenderer, RenderBlocks, lectureNavigationTargets)
- [ ] Keep `ACTIVE_TEMPLATE_PATH` and `readActiveTemplate` imports for single-lecture mode

## Expected Behavior

- When `lectures/` is absent: identical behavior to before (renders single lecture)
- When `lectures/` has valid lectures: renders collection landing page
- When `lectures/` has mixed valid/invalid: landing page shows validation status per lecture
- Backward compatibility: single-lecture workflow completely unchanged

## Verification

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

## Notes

- This task depends on LecturePage being extracted (Task 2) — if Task 2 isn't done yet, the single-lecture path still uses inline JSX
- The collection landing page wraps in `<PageShell>` for consistent layout
- Keep the `export const dynamic = "force-dynamic"` to ensure server-side rendering
