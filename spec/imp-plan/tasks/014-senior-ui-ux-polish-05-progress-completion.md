# Task 05: Compress Progress and Strengthen Completion Controls

## Goal

Refactor progress UI to be compact and mobile-friendly, with stronger section completion controls.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/progress/LectureProgressBar.tsx`
- **Modify**: `src/components/lecture-kit/progress/SectionCompletionToggle.tsx`
- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/progress-ui-enhancement.test.tsx` (new test file)

## Checklist

- [ ] Refactor `LectureProgressBar` markup for compact presentation
- [ ] On mobile, collapse milestone boxes into text summary or hide from visual layout
- [ ] Move "Reset progress" to secondary placement (inline secondary button, details menu, or right-aligned)
- [ ] Keep `role="progressbar"`, text equivalents, localStorage messaging, resume prompt, live announcements
- [ ] Enlarge `SectionCompletionToggle` mobile hit area to at least 44px
- [ ] Make label plain language: "Mark complete" / "Completed"
- [ ] Preserve `aria-pressed` and keyboard operation
- [ ] Avoid dimming completed section body text
- [ ] Add CSS for compact progress and larger completion toggle
- [ ] Add tests verifying:
  - Progress bar accessible values remain
  - Reset action is secondary and keyboard reachable
  - Section completion toggle has proper ARIA and touch-friendly markup

## Expected Behavior

Progress UI should:
1. Be compact enough that mobile learners reach content quickly
2. Show milestones as text summary on mobile (not large boxes)
3. Have secondary "Reset progress" action (not dominant)
4. Section completion toggle:
   - Minimum 44px touch target
   - Clear "Mark complete" / "Completed" labels
   - `aria-pressed` state preserved
   - Keyboard accessible

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/progress-ui-enhancement.test.tsx
npm run test -- tests/lecture-template/progress-provider.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure print rules still reveal progress information
