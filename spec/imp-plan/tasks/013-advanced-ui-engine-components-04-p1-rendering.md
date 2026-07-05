# Task: Render P1 Advanced Components

## Goal

Implement and dispatch the P1 advanced components: `accordion`, `flashcard`, `resource_links`, and `timeline`.

## Dependencies

- `013-advanced-ui-engine-components-01-types.md`
- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/Accordion.tsx` - Render optional-depth sections with native disclosure behavior.
- `src/components/lecture-kit/Flashcard.tsx` - Render keyboard-operable prompt-and-reveal cards.
- `src/components/lecture-kit/ResourceLinks.tsx` - Render curated resource links with visible URL context.
- `src/components/lecture-kit/Timeline.tsx` - Render responsive ordered events or stages.
- `src/components/lecture-kit/SectionRenderer.tsx` - Dispatch the four P1 component types.

## Checklist

- [x] Render `Accordion` with `<details>/<summary>` where practical and `default_open` items opened by default.
- [x] Keep accordion body content present in static markup and add print-visible hooks or fallback content so print behavior is testable.
- [x] Render `Flashcard` answer hidden by default in browser preview, with a button using `aria-expanded`.
- [x] Use `Reveal answer` and `Hide answer` button labels for flashcards; do not use `Submit` or grading language.
- [x] Ensure multiple flashcards keep independent reveal state.
- [x] Render `ResourceLinks` with label, optional description/category, visible hostname or local path, external treatment for `http`/`https`, and full URL visibility in print.
- [x] Render `Timeline` as a readable sequence with labels, details, optional dates, and text/ARIA marker labels that do not rely only on color.
- [x] Ensure timeline markup and wrapper classes can avoid horizontal overflow at 390px, 768px, and 1280px.
- [x] Add P1 cases to `SectionRenderer` while preserving existing P0 and legacy component dispatch.
- [x] Confirm `npm run typecheck` passes after all nine P0/P1 union members are dispatched.

## Expected Behavior

P1 components render in the same lecture section path as existing components. Reveal and disclosure controls are keyboard-operable, static markup remains readable without JavaScript, and print/review output can expose collapsed or hidden content.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/advanced-components-interaction.test.tsx
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify examples, docs, review-package code, or unrelated component behavior in this task.
