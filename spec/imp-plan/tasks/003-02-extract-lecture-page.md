# Task: Extract LecturePage Component

**Goal**: Extract the inline lecture rendering logic from `src/app/page.tsx` into a reusable `LecturePage` server component.

**Dependencies**: None (can be done in parallel with Task 1)

## Files to Create/Modify

- `src/components/lecture-kit/LecturePage.tsx` — New shared component
- `src/app/page.tsx` — Refactor to use `LecturePage`

## Checklist

### LecturePage.tsx creation
- [ ] Create `LecturePage` server component with props: `{ lecture: LectureTemplate; templatePath: string }`
- [ ] Move the rendering JSX from `page.tsx` lines 23-59 into `LecturePage`
- [ ] Import `LectureHeader`, `SectionNavigation`, `SectionRenderer`, `RenderBlocks` from existing components
- [ ] Import `lectureNavigationTargets` from `navigationTargets`
- [ ] Import `LectureTemplate` type from `@/lib/lecture-template/types`
- [ ] Component renders: `PageShell > LectureHeader + lecture-layout (SectionNavigation + article with overview, objectives, sections, takeaways)`

### page.tsx refactoring
- [ ] Import `LecturePage` instead of individual components
- [ ] Replace inline JSX with `<LecturePage lecture={result.template} templatePath={ACTIVE_TEMPLATE_PATH} />`
- [ ] Keep `ValidationScreen` rendering for invalid templates unchanged
- [ ] Remove imports that are no longer used directly in page.tsx (LectureHeader, SectionNavigation, SectionRenderer, RenderBlocks, lectureNavigationTargets)
- [ ] Verify the `export const dynamic = "force-dynamic"` remains

## Expected Behavior

- Single-lecture rendering produces identical output to before the refactor
- `LecturePage` is a pure extraction; no behavior change
- Existing tests pass without modification

## Verification

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

## Notes

- This is a pure refactor task — no new features, just code extraction
- The `ValidationScreen` wraps itself in `<main>` and does NOT use `PageShell`. Leave this as-is for now; the per-lecture route will handle this differently.
- Keep `templatePath` prop on `LecturePage` even though it's not currently used in the rendering — it will be useful for debugging and future features
