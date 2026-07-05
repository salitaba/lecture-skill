# Task: Wire Lecture Progress UI

## Goal

Show lecture-level progress and section completion toggles on lecture pages while preserving existing section anchors, layout, and static readability.

## Dependencies

- `012-progress-tracking-01-model-storage.md`
- `012-progress-tracking-02-provider.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/LecturePage.tsx` - Mount the provider and progress bar.
- `src/components/lecture-kit/SectionRenderer.tsx` - Render section toggle and completed visual state.
- `src/components/lecture-kit/progress/LectureProgressBar.tsx` - New progress summary/bar/reset component.
- `src/components/lecture-kit/progress/SectionCompletionToggle.tsx` - New toggle component.
- `src/components/lecture-kit/progress/ProgressLiveRegion.tsx` - New live-region component if not handled by the provider.
- `tests/lecture-template/lecture-components.test.tsx` - Static markup and ARIA coverage.
- `tests/lecture-template/progress-provider.test.tsx` - Interaction coverage may be extended here if component-level tests are simpler.

## Checklist

- [x] Generate a stable single-lecture progress id from `templatePath` and lecture metadata fallback.
- [x] Render a progress bar below `LectureHeader` and above `.lecture-layout`.
- [x] Add `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`, and `aria-label="Lecture progress"`.
- [x] Display `X of Y sections completed` near the bar.
- [x] Add a "Reset progress" control with confirmation text from the spec.
- [x] Add a completion toggle next to each authored section heading.
- [x] Use button toggles with `aria-pressed` and labels: `Mark [section title] complete` / `Mark [section title] incomplete`.
- [x] Add a subtle completed section class without dimming body text.
- [x] Keep Overview, Learning Objectives, Key Takeaways, and answer key outside progress totals.
- [x] Add tests for zero sections, partial progress, completed state, reset confirmation, accessible labels, and unchanged section anchor ids.

## Expected Behavior

A learner can mark each authored section complete or incomplete, see the lecture percentage update, and reset progress without disrupting reading or navigation.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/progress-provider.test.tsx
```

Run `npm run typecheck` after collection wiring if exported prop types are still moving.

## Cleanup Notes

Do not introduce template schema changes or generated example output in this task.
