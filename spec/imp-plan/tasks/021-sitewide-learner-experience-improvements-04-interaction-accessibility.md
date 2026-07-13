# Task 04: Complete Focus, Touch Targets, Checklist, Radio, and Tab Accessibility

## Goal

Make existing interactive learning controls reliably operable by keyboard, screen reader, and touch without replacing native input semantics or changing answer/progress persistence.

## Dependencies

- Tasks 01–03 should land first so global focus and responsive surface styles have one current location.
- Preserve the existing `Tabs.tsx` implementation unless a regression test demonstrates a real defect; this task primarily adds coverage for its already-shipped behavior.

## Exact Files to Create or Modify

- **Modify**: `src/components/lecture-kit/Checklist.tsx`
- **Modify if needed**: `src/components/component-kit/RadioOptionGroup.tsx`
- **Modify**: `src/components/lecture-kit/progress/SectionCompletionToggle.tsx`
- **Modify**: `src/app/globals.css`
- **Modify**: `tests/lecture-template/advanced-components-interaction.test.tsx`
- **Modify**: `tests/lecture-template/quiz-interaction.test.tsx`
- **Modify**: `tests/lecture-template/assessment-interaction.test.tsx`
- **Modify**: `tests/lecture-template/progress-ui-enhancement.test.tsx`

## Checklist

- [x] Extend `:focus-visible` styling to textareas, text inputs, selects, native checkboxes, and native radios with light/dark contrast-safe outlines that are not clipped.
- [x] Restructure checklist rows so input and text are inside one label-owned target while preserving list semantics, accessible names, and existing localStorage behavior.
- [x] Ensure quiz/question option labels and checklist rows have an explicit minimum 44px block target and spacing between separate controls.
- [x] Make the section-completion control itself 44px; do not depend only on a surrounding row for hit area.
- [x] Preserve native radio-group semantics and arrow-key behavior; do not replace inputs with custom visual controls.
- [x] Add/extend tests proving clicking the full checklist/option label toggles exactly one input, selected and accessible states remain correct, and native radios remain keyboard-operable.
- [x] Extend `advanced-components-interaction.test.tsx` for Tabs Home/End, wraparound, selected `tabIndex`, focus movement, and selected-state synchronization. Do not rewrite `Tabs.tsx` without a failing behavior test.
- [x] Audit any new interaction transitions against existing `--motion-*` tokens and `prefers-reduced-motion`; do not add layout-moving animation.

## Expected Behavior

- Keyboard focus is visible on every form/control type in both themes.
- A learner can tap/click anywhere on a checklist or answer row to operate the one associated native input, and all rows meet the 44px target requirement.
- Native radios retain expected semantics and keyboard operation.
- Tabs respond to Arrow keys plus Home/End and maintain one active tab with correct focus/`tabIndex` state, including wraparound where already specified.
- Reduced-motion users do not receive new moving animations or forced smooth scrolling.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/advanced-components-interaction.test.tsx tests/lecture-template/quiz-interaction.test.tsx tests/lecture-template/assessment-interaction.test.tsx tests/lecture-template/progress-ui-enhancement.test.tsx
npm run lint
```

## Cleanup Notes

- No persistent data cleanup beyond existing answer/checklist/progress test setup; clear any seeded localStorage and restore DOM focus mocks after each test.
- Do not add dependencies, custom input widgets, grading behavior, or analytics.
- Keep existing reduced-motion CSS guard and token names unchanged.
