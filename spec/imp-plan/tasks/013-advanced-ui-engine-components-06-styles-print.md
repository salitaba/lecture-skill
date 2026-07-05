# Task: Add Advanced Component Styles And Print Rules

## Goal

Add shared responsive, accessible, and print-friendly styles for all ten advanced components using the existing lecture-kit visual language.

## Dependencies

- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`
- `013-advanced-ui-engine-components-05-instructor-review-package.md`

## Exact Files To Create Or Modify

- `src/app/globals.css` - Add advanced component classes, responsive rules, focus states, overflow protections, reduced-motion handling, and print rules.
- `tests/lecture-template/lecture-components.test.tsx` - Add static class/hook assertions if existing rendering tests verify print hooks.
- `tests/lecture-template/advanced-components-interaction.test.tsx` - Add interaction-adjacent print hook assertions only if needed.

## Checklist

- [x] Add styles for `.glossary-term` and `.glossary-aliases`.
- [x] Add styles for `.tabs`, `.tabs-list`, `.tabs-panel`, active tab controls, and no-JavaScript all-panel output.
- [x] Add styles for `.accordion` and `.accordion-item`.
- [x] Add styles for `.timeline`, `.timeline-item`, and `.timeline-marker`.
- [x] Add styles for `.checklist`, `.checklist-item`, and `.checklist-reset`.
- [x] Add styles for `.flashcard`, `.flashcard-answer`, and `.flashcard-hint`.
- [x] Add styles for `.worked-example` and `.worked-example-region`.
- [x] Add styles for `.mistake-correction`, `.mistake-region`, and `.correction-region`.
- [x] Add styles for `.resource-links` and `.resource-link-url`.
- [x] Add styles for `.instructor-note`.
- [x] Match existing palette, spacing, and component radius conventions; keep radius at 8px or less unless existing styles require otherwise.
- [x] Add `overflow-wrap: anywhere` or equivalent for labels, URLs, definitions, examples, and tab content.
- [x] Add mobile-first rules so layouts remain single-column where appropriate.
- [x] Add print rules that show all tab panels, expanded accordion content, flashcard hints/answers, unchecked checklist boxes, full resource URLs, worked example solutions, mistake corrections, and instructor notes.
- [x] Add `prefers-reduced-motion` handling for reveal or transition polish.

## Expected Behavior

All advanced components look consistent with existing lecture-kit components, avoid horizontal overflow on narrow screens, expose focus state for controls, and print as an instructor/reviewer handout with hidden or collapsed content visible.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/advanced-components-interaction.test.tsx
npm run lint
```

Manual verification after examples are updated:

```bash
npm run dev
```

Inspect the component demo at 390px, 768px, and 1280px and use browser print preview to confirm hidden/collapsed content is visible.

## Cleanup Notes

- Stop any dev server started for manual checks.
- Remove generated `.next/` output if it is not intentionally retained locally.
