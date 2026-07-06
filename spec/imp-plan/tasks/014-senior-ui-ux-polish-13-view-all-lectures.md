# Task 13: Add Secondary "View All Lectures" Anchor

## Goal

Add a secondary "View all lectures" anchor to the collection landing page when lecture list is not visible near the first viewport.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/collection-landing-anchor.test.tsx` (new test file)

## Checklist

- [ ] Add "View all lectures" anchor after CTA and compact metadata
- [ ] Anchor should link to `#lecture-list` section
- [ ] Only show anchor if lecture list is not visible near first viewport (use CSS or conditional rendering)
- [ ] Style anchor as secondary action
- [ ] Add tests verifying anchor presence and behavior
- [ ] Ensure anchor is accessible and keyboard reachable

## Expected Behavior

Collection landing should:
1. Show "View all lectures" anchor after CTA and metadata
2. Anchor links to lecture list section
3. Anchor is styled as secondary action
4. Anchor is accessible and keyboard reachable

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/collection-landing-anchor.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure anchor doesn't duplicate if lecture list is already visible
