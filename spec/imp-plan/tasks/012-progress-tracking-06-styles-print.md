# Task: Add Progress Styles And Print Output

## Goal

Style progress controls consistently with the lecture kit and ensure print output includes completion status without interactive controls.

## Dependencies

- `012-progress-tracking-03-lecture-ui.md`
- `012-progress-tracking-04-collection-ui.md`
- `012-progress-tracking-05-accessibility-polish.md`

## Exact Files To Create Or Modify

- `src/app/globals.css` - Progress, collection mini-bar, resume prompt, toast, responsive, reduced-motion, and print styles.
- `tests/lecture-template/lecture-components.test.tsx` - Static class/print-hook assertions where useful.

## Checklist

- [x] Add lecture progress bar, fill, summary, reset control, and milestone styles.
- [x] Add section heading row, toggle, completed label, focus, hover, active, and completed-section styles.
- [x] Add collection overall and mini progress bar styles.
- [x] Add resume prompt and toast styles.
- [x] Keep controls usable at mobile widths and 200% zoom.
- [x] Use existing CSS variables and radii no larger than existing card conventions.
- [x] Hide interactive reset/toggle controls in print where appropriate.
- [x] Show completion status text next to section headings in print.
- [x] Add reduced-motion overrides for width transitions, scale effects, and toast animation.

## Expected Behavior

Progress UI feels native to the lecture kit, remains readable on mobile and print, and does not create layout overlap or visual noise.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run lint
```

## Cleanup Notes

No generated screenshots are required unless implementation exposes a visual regression that needs manual inspection.
