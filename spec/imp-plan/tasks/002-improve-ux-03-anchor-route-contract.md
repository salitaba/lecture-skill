# 002 Improve UX - 03 Anchor And Route Contract

## Goal

Centralize fixed destination IDs and wire the route/navigation contract so Overview, Learning Objectives, authored sections, and Key Takeaways cannot drift.

## Dependencies

- `002-improve-ux-02-component-contract-tests.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/navigationTargets.ts` or an equivalent shared constants module
- `src/app/page.tsx`
- `src/components/lecture-kit/SectionNavigation.tsx`
- `tests/lecture-template/lecture-components.test.tsx`

## Checklist

- [x] Define shared constants for the fixed non-section destinations:
  - `overview-heading`
  - `objectives-heading`
  - `takeaways-heading`
- [x] Include href values derived from those IDs, for example `#overview-heading`, `#objectives-heading`, and `#takeaways-heading`.
- [x] Use the shared constants in `src/app/page.tsx` for heading `id` and `aria-labelledby` values.
- [x] Use the same shared constants in `SectionNavigation` for the fixed navigation items.
- [x] Continue using `section.anchor` from the validated render model for authored section hrefs.
- [x] Do not add active-section tracking or `aria-current` in this task.
- [x] Keep route composition server-rendered and local-first. Do not add runtime network dependencies.
- [x] Keep all lecture rendering UI under `src/components/lecture-kit/`; route files should only compose components and pass data.
- [x] Update tests so navigation hrefs match actual rendered heading IDs for the fixed destinations and authored sections.

## Expected Behavior

- Anchor links exist for Overview, Learning Objectives, every authored section, and Key Takeaways.
- Fixed destination IDs are not duplicated as unrelated literals across route and navigation.
- Duplicate authored section titles keep working because section-specific anchors still come from the parser.
- Normal anchor navigation works without JavaScript.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx tests/lecture-template/render-model.test.ts
npm run typecheck
```

## Cleanup Notes

- No manual fixture replacement is required for this task.
- If temporary route markup was created for debugging, remove it before finishing.
