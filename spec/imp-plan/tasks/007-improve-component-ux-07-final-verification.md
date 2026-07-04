# Task: Final Verification

## Goal

Run the complete automated quality gate plus mandatory manual single-lecture, collection/static package, viewport overflow, and print checks for the improved component UX.

## Dependencies

- `007-improve-component-ux-01-labels-markup.md`
- `007-improve-component-ux-02-visual-styles-print.md`
- `007-improve-component-ux-03-component-demo-gallery.md`
- `007-improve-component-ux-04-rendering-tests.md`
- `007-improve-component-ux-05-demo-fixture-coverage.md`
- `007-improve-component-ux-06-docs-agent-guidance.md`

## Exact Files To Create Or Modify

- No production, test, example, or documentation files should be changed in this task unless verification exposes a defect.
- If a defect is found, return to the owning earlier task file, make the smallest fix there, then rerun this final verification task.
- `content/lecture.template.md` - Temporarily replace for manual single-lecture preview only, then restore.

## Checklist

- [ ] Run focused rendering tests:

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

- [ ] Run focused fixture and validation tests:

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
```

- [ ] Run focused collection tests:

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
```

- [ ] Run broad automated quality gates:

```bash
npm run validate
npm run test
npm run typecheck
npm run lint
npm run build
npm run package:review
```

- [ ] Save the current `content/lecture.template.md` before replacing it.
- [ ] Ensure there is no root `lectures/` directory selected for collection mode. If one exists and cannot safely be moved, record the blocker instead of deleting unrelated work.
- [ ] Copy `examples/component-demo.template.md` to `content/lecture.template.md`.
- [ ] Run `npm run validate` against the copied component demo.
- [ ] Run `npm run dev` and inspect the local page in single-lecture mode.
- [ ] At 390px viewport width, run:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

- [ ] At 768px viewport width, run:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

- [ ] At 1280px viewport width, run:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

- [ ] Confirm long comparison labels and values wrap without clipping, overlap, or body-level overflow.
- [ ] Confirm long quote text wraps without clipping and attribution remains visually attached.
- [ ] Confirm long quiz questions, options, answers, and explanations wrap cleanly and the answer key is visibly intentional.
- [ ] Confirm code captions and language labels wrap and long code lines scroll inside the code block.
- [ ] Check print preview for comparison, quote, and quiz.
- [ ] Confirm print preview keeps quote attribution attached to the quote text.
- [ ] Confirm print preview keeps the quiz answer key visible and clearly labeled.
- [ ] Confirm the same improved component UX appears in a collection route.
- [ ] Confirm a generated static review package shows the improved component UX without package-specific component logic.
- [ ] Restore the original `content/lecture.template.md`.
- [ ] Stop the dev server.

## Expected Behavior

- All focused and broad automated commands pass.
- The component demo validates and renders all eight supported component types.
- No body-level horizontal overflow occurs at 390px, 768px, or 1280px.
- Long comparison, quote, quiz, and code content wraps or scrolls internally without clipping or overlap.
- Single-lecture, collection, and static review package behavior remain unchanged except for improved component presentation.
- Print preview keeps comparison readable, quote attribution attached, and quiz answer key visible.

## Verification Commands

Focused:

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
```

Broad:

```bash
npm run validate
npm run test
npm run typecheck
npm run lint
npm run build
npm run package:review
```

Manual preview:

```bash
npm run dev
```

Manual overflow expression:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

## Cleanup Notes

- Restore the original `content/lecture.template.md` before finishing.
- Stop the dev server.
- Remove generated review package output, `.next-review/`, `out/`, or temporary staging directories only if they were created by this task and are not needed for handoff.
- Do not delete or revert unrelated local changes, including uncommitted work from other implementation slices.
