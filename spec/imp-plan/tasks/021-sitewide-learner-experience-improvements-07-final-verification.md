# Task 07: Run Full Spec 021 Verification and Manual Responsive Audit

## Goal

Verify the complete Spec 021 implementation across automated tests, type/lint/build checks, responsive layouts, themes, accessibility paths, hydration/static output, and resilience states. This task is verification only and must not introduce new product decisions.

## Dependencies

- Complete Tasks 01–06.
- Use the active 11-lecture Life Cycle Assessment collection, first/middle/last lecture routes, and component-demo lecture for manual checks.

## Exact Files to Create or Modify

- **Modify**: none. This task records verification results only; do not change production or test code while running it unless a preceding task is incomplete.

## Checklist

- [x] Run the focused collection tests from Tasks 01–02.
- [x] Run the focused lecture/progress/interaction/dialog tests from Tasks 03–05.
- [x] Run typecheck and lint.
- [x] Run the complete test suite and production build.
- [ ] Inspect collection, first lecture, middle lecture, last lecture, and component-demo lecture at 390px, 768px, and 1440px in both light and dark themes.
- [ ] Confirm first viewport answers what the course is, how long it takes, and where to start; no learner-facing “passing” language appears in the primary summary.
- [ ] Confirm course-matching audience/level metadata is suppressed on lecture cards, facts labels/values align from one left edge, and long descriptions disclose full static text.
- [ ] Confirm loading, not-saved/session-only, zero, in-progress, complete, invalid-review, resume, and reset states are textually truthful and do not rely on color.
- [ ] Navigate keyboard-only from skip link through theme control, facts/details, progress, learning path, reading content, tabs, radios/checklists, dialogs, disclosures, and end pager; verify focus visibility and 44px targets.
- [ ] Verify 200% zoom/reflow, no horizontal page scroll, reduced-motion behavior, localStorage blocked behavior, delayed hydration, and static review package/no-JavaScript output.
- [ ] Check contrast in both themes for body/muted text, focus ring, selected tab, progress, success, warning, disabled state, and dialog scrim.
- [x] Record any failure against the responsible earlier task; do not silently broaden scope or change schemas/persistence.

## Expected Behavior

- All automated commands pass, and the build produces the existing static/review output successfully.
- The complete learner journey is content-first, scanable, responsive, keyboard-operable, readable, and truthful before and after hydration.
- No regression appears in native anchors/history, progress persistence, tabs, diagrams, annotations, print, or static export behavior.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/collection-cta.test.tsx tests/lecture-template/lecture-list-state.test.tsx tests/lecture-template/collection-progress-integration.test.tsx
npm test -- tests/lecture-template/progress-ui-enhancement.test.tsx tests/lecture-template/advanced-components-interaction.test.tsx tests/lecture-template/section-note.test.tsx tests/lecture-template/diagram-inspection.test.tsx
npm run typecheck
npm run lint
npm test
npm run build
```

## Cleanup Notes

- Remove temporary browser screenshots, review-package staging folders, and test localStorage only if the verification harness created them; do not remove user-owned artifacts.
- Restore mocked storage, theme, media-query, reduced-motion, viewport, dialog, and focus state after manual/automated checks.
- Do not modify production or test code as part of this verification task; log follow-up defects as separate tasks if needed.
