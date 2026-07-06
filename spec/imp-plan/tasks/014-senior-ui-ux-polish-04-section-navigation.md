# Task 04: Improve Active Section and Mobile Learning-Path Navigation

## Goal

Enhance `SectionNavigation` to show active section state and improve mobile learning-path disclosure.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/SectionNavigation.tsx`
- **Create**: `src/components/lecture-kit/LearningPathNavigation.tsx` (client component for active state)
- **Modify**: `tests/lecture-template/lecture-components.test.tsx`
- **Create**: `tests/lecture-template/section-navigation-enhancement.test.tsx` (new test file)

## Checklist

- [ ] Convert `SectionNavigation` to client component or split into server wrapper + client child
- [ ] Reuse `ProgressProvider.currentSectionAnchor` for authored sections
- [ ] Add observer for overview/objectives/takeaways anchors (non-authored sections)
- [ ] Render `aria-current="location"` on active anchor
- [ ] Add non-color cue: left rule, bold text, or visible/screen-reader-only "Current" text
- [ ] Preserve normal anchor hrefs and static markup before JS runs
- [ ] Update mobile `details` summary with:
  - "Learning path" text
  - Section count
  - Chevron or "Open contents" text via CSS
- [ ] Ensure summary is at least 44px high
- [ ] Ensure long section labels wrap properly
- [ ] Update tests that assert `aria-current` is absent (line 62 in lecture-components.test.tsx)

## Expected Behavior

Desktop navigation should:
1. Show current section with `aria-current="location"`
2. Use non-color cue (left border, bold text, or "Current" label)
3. Degrade gracefully without JavaScript

Mobile navigation should:
1. Show "Learning path" with section count
2. Include visible chevron or "Open contents" text
3. Have minimum 44px tap target height
4. Allow long labels to wrap

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/section-navigation-enhancement.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure hydration mismatch is avoided (initial server markup should work without JS)
