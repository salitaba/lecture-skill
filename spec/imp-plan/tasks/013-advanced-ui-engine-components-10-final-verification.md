# Task: Final Advanced Components Verification

## Goal

Run the focused and full verification suite for the advanced UI engine components and confirm the implementation remains backward compatible.

## Dependencies

- `013-advanced-ui-engine-components-01-types.md`
- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`
- `013-advanced-ui-engine-components-05-instructor-review-package.md`
- `013-advanced-ui-engine-components-06-styles-print.md`
- `013-advanced-ui-engine-components-07-examples-fixtures.md`
- `013-advanced-ui-engine-components-08-docs-agent-guidance.md`
- `013-advanced-ui-engine-components-09-focused-tests.md`

## Exact Files To Create Or Modify

- No production or test files expected.
- Update only task/checklist documentation if verification exposes stale implementation instructions.

## Checklist

- [x] Run all focused validation, rendering, interaction, fixture, review-package, collection, and backward-compatibility tests.
- [x] Run full test, typecheck, lint, validate, and review-package commands.
- [ ] Start a local dev server and inspect the component demo in browser preview if available.
- [ ] Check viewport behavior at 390px, 768px, and 1280px with no horizontal body overflow.
- [ ] Keyboard-check tabs, checklist reset, flashcard reveal/hide, and accordion disclosure controls.
- [ ] Check print preview for the component demo: all tab panels, accordion bodies, flashcard hints/answers, resource URLs, worked example solutions, mistake corrections, checklist boxes, and instructor notes are visible.
- [x] Confirm review package output preserves source content and includes component counts, resource link summaries, and instructor-note presence.
- [x] Confirm existing valid templates, invalid fixtures, assessment components, diagrams, progress tracking, and collection rendering still behave as before.
- [x] Confirm no optional out-of-scope P2 polish was accidentally introduced: arbitrary plugins, remote fetching, LMS behavior, analytics, grading, secure hiding, runtime AI tutoring, copy actions, glossary index, review mode toggle, or checklist bulk controls.

## Expected Behavior

All ten advanced components are validated, rendered, documented, covered by tests, visible in print/review workflows, and additive to the existing lecture authoring schema.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/advanced-components-interaction.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/review-package.test.ts
npm run test -- tests/lecture-template/backward-compat.test.tsx
npm run test
npm run typecheck
npm run lint
npm run validate
npm run package:review
```

Manual checks:

```bash
npm run dev
```

## Cleanup Notes

- Stop any dev server started for manual checks.
- Remove generated `.next/`, `out/`, or `review-packages/` artifacts created during verification unless they are already ignored and intentionally retained locally.
- Clear browser `localStorage` entries created while testing checklist behavior.
