# Task 08: Visual Hierarchy, Responsive, and Print Polish

## Goal

Update CSS to establish clearer visual hierarchy across page regions.

## Files to Create/Modify

- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/visual-hierarchy.test.tsx` (new test file)

## Checklist

- [ ] Reduce equal-weight card noise:
  - Reserve strong bordered surfaces for major regions only
  - Use lighter metadata rows/dividers for progress, assessment metadata, validation status
- [ ] Make overview/objectives feel like starting aids
- [ ] Make authored sections read as main reading path
- [ ] Make takeaways/answer key feel like end-of-lesson review
- [ ] Add/adjust CSS selectors for:
  - `.collection-primary-action`, `.collection-action-row`, `.collection-review-status`
  - `.assessment-index` disclosure/grouping
  - Active `.nav-item` / `[aria-current="location"]`
  - Mobile `.learning-path-mobile summary` chevron/open label
  - Compact `.lecture-progress` and milestone mobile treatment
  - Larger `.section-completion` mobile hit area
  - Quiz selected/correct/incorrect feedback states
  - Lecture top and bottom navigation
- [ ] Verify no horizontal overflow at 390px, 768px, 1280px
- [ ] Preserve print rules for answers/guidance and hide interactive-only controls
- [ ] Add tests verifying no overflow at key viewports

## Expected Behavior

Visual hierarchy should:
1. Distinguish major page regions (header, content, review)
2. Reduce visual noise from equal-weight cards
3. Use typography, spacing, and grouping before borders
4. Maintain responsive behavior at all viewports
5. Keep print output useful

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/visual-hierarchy.test.tsx
npm run build
```

## Cleanup Notes

- No data cleanup required
- Ensure no decorative redesign beyond spec guidance
