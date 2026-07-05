# Task: Add Accessibility, Resume, Keyboard, And Motion Polish

## Goal

Implement the P1 learner-experience polish that depends on the base progress contract: keyboard shortcuts, resume prompt, live announcements, milestones, and completion feedback.

## Dependencies

- `012-progress-tracking-02-provider.md`
- `012-progress-tracking-03-lecture-ui.md`
- `012-progress-tracking-04-collection-ui.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/progress/ProgressProvider.tsx` - Add announcements and optional current-section tracking.
- `src/components/lecture-kit/progress/ResumePrompt.tsx` - New prompt component.
- `src/components/lecture-kit/progress/LectureProgressBar.tsx` - Add milestone indicators if not already present.
- `src/app/globals.css` - Add animation/reduced-motion styles for prompt, milestones, and toast.
- `tests/lecture-template/progress-provider.test.tsx` - Keyboard/live-region/resume tests.

## Checklist

- [x] Announce progress changes in an `aria-live="polite"` region.
- [x] Add `Alt+M` to toggle the current section, using `IntersectionObserver` when available and a deterministic fallback when not.
- [x] Add `Alt+R` to trigger the same reset confirmation as the visible reset control.
- [x] Add a resume prompt for 1-99% progress after storage load.
- [x] Implement "Jump to section" and session-only dismiss behavior for the resume prompt.
- [x] Add 25%, 50%, 75%, and 100% milestone indicators without relying only on color.
- [x] Add a small completion toast or animation that dismisses after 1.5 seconds.
- [x] Respect `prefers-reduced-motion` for all transitions and animations.
- [x] Add tests for shortcut behavior, live-region copy, prompt render/dismiss/jump, and timer cleanup.

## Expected Behavior

Progress changes are understandable to keyboard and screen-reader users, partial progress can be resumed quickly, and motion effects remain subtle and optional.

## Verification Commands

```bash
npm run test -- tests/lecture-template/progress-provider.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

Restore mocked `IntersectionObserver`, timers, and media query helpers after tests.
