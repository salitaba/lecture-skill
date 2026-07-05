# Task: Render P0 Advanced Components

## Goal

Implement and dispatch the P0 advanced instructional components: `glossary_term`, `checklist`, `worked_example`, `mistake_correction`, and `tabs`.

## Dependencies

- `013-advanced-ui-engine-components-01-types.md`
- `013-advanced-ui-engine-components-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/GlossaryTerm.tsx` - Render glossary terms with semantic definition markup where practical.
- `src/components/lecture-kit/Checklist.tsx` - Render local learner checklist UI.
- `src/components/lecture-kit/WorkedExample.tsx` - Render problem, walkthrough, solution, optional starter code, and takeaway.
- `src/components/lecture-kit/MistakeCorrection.tsx` - Render mistake, failure explanation, correction, and optional before/after examples.
- `src/components/lecture-kit/Tabs.tsx` - Render static all-panel markup with progressive enhancement for interactive tabs.
- `src/components/lecture-kit/SectionRenderer.tsx` - Dispatch the five P0 component types.
- `src/components/lecture-kit/LecturePage.tsx` - Pass stable lecture identity into section rendering only if `checklist.storage: local` is supported.
- `src/components/lecture-kit/CollectionLanding.tsx` and collection lecture routes/components - Preserve stable lecture identity for collection rendering only if local checklist persistence needs it.

## Checklist

- [x] Render one `.lecture-component` surface per component and avoid nested card shells.
- [x] Render `GlossaryTerm` with a visible `Glossary` label, prominent term, definition, optional context, and secondary aliases.
- [x] Render `Checklist` with unchecked first-paint boxes, local UI state, no grading/submission wording, safe storage-unavailable behavior, and reset support when `reset_label` is present.
- [x] If `storage: local` is implemented, derive a stable component runtime id from lecture identity, section anchor, and component ordinal; otherwise reject `storage: local` in validation.
- [x] Render `WorkedExample` with clearly labeled problem, ordered walkthrough, solution, optional starter code/language, and optional takeaway.
- [x] Render `MistakeCorrection` with clear mistake, why-it-fails, and correction regions; stack before/after examples on mobile.
- [x] Render `Tabs` so server/static markup includes every panel in authored order.
- [x] Enhance `Tabs` after hydration to show one active panel with ARIA tablist semantics, click switching, and keyboard switching.
- [x] Ensure inactive tab panels are not marked `hidden` in static server markup before enhancement.
- [x] Use stable unique DOM ids for repeated tab components; do not derive ids only from titles or labels.
- [x] Add P0 cases to `SectionRenderer` while preserving the existing exhaustiveness check.

## Expected Behavior

P0 components render in single-lecture and collection paths. Tabs and checklist interactions enhance the static content without hiding content from no-JavaScript output, print output, or review-package source preservation.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/advanced-components-interaction.test.tsx
npm run typecheck
```

If `advanced-components-interaction.test.tsx` does not exist yet, create it in `013-advanced-ui-engine-components-09-focused-tests.md` and run the focused rendering tests available at this stage.

## Cleanup Notes

- This task should not create persistent learner data outside browser local state used by component tests.
- Clear `localStorage` in interaction tests that exercise `checklist.storage: local`.
- Do not modify examples, docs, review-package code, or unrelated components in this task.
