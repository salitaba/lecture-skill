# Task: Add Focused Advanced Component Tests

## Goal

Add focused parser, validation, rendering, interaction, review-package, fixture, and backward-compatibility tests for the advanced component vocabulary.

## Dependencies

- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`
- `013-advanced-ui-engine-components-05-instructor-review-package.md`
- `013-advanced-ui-engine-components-06-styles-print.md`
- `013-advanced-ui-engine-components-07-examples-fixtures.md`

## Exact Files To Create Or Modify

- `tests/lecture-template/parseTemplate.test.ts` - Add parser proof for new fenced YAML component blocks if current parser coverage is insufficient.
- `tests/lecture-template/validateTemplate.test.ts` - Add supported-type, invalid-field, URL, enum, duplicate-label, and normalization tests.
- `tests/lecture-template/render-model.test.ts` - Add normalized render-model assertions if this file owns shape coverage.
- `tests/lecture-template/lecture-components.test.tsx` - Add static rendering and `SectionRenderer` dispatch tests for all ten components.
- `tests/lecture-template/advanced-components-interaction.test.tsx` - Create interaction tests for tabs, checklist, flashcard, and accordion.
- `tests/lecture-template/review-package.test.ts` - Add component count, resource link, instructor-note, and source-preservation tests.
- `tests/lecture-template/fixtures.test.ts` - Ensure valid and invalid advanced fixtures are swept.
- `tests/lecture-template/backward-compat.test.tsx` - Add regression coverage proving existing templates still validate/render.
- `tests/lecture-template/collection.test.ts` or collection rendering tests - Add collection fixture coverage if new multi-lecture examples require explicit assertions.

## Checklist

- [x] Test every new component type in a synthetic valid template.
- [x] Test required field and list-minimum failures produce `INVALID_COMPONENT_FIELD`.
- [x] Test duplicate tab labels, invalid `default_tab`, invalid `default_open`, invalid enums, and invalid URLs with author-locatable messages.
- [x] Test normalized defaults, trimmed strings, omitted optional fields, and preserved authored order for all ten types.
- [x] Test static rendering labels and core content for all ten components.
- [x] Test `SectionRenderer` dispatch for all ten component types.
- [x] Test component string fields do not render raw unsafe HTML.
- [x] Test print-visible hooks or print-only content for tabs, accordion, flashcard answers, checklist boxes, worked example solutions, mistake corrections, resource URLs, and instructor notes.
- [x] Test repeated `tabs` components produce unique tab/panel DOM ids.
- [x] Test server/static tabs markup contains every panel and no inactive-panel `hidden` attributes before enhancement.
- [x] Test tabs click and keyboard switching.
- [x] Test checklist local state, reset behavior, independent components, and storage-unavailable recovery.
- [x] Test flashcard reveal/hide behavior and independent state between multiple cards.
- [x] Test accordion native disclosure/default-open behavior.
- [x] Test review package source preservation, component counts by type, resource link summaries, and instructor-note summaries.
- [x] Test existing golden, assessment, diagram, collection, and invalid fixtures keep their expected behavior.

## Expected Behavior

The advanced component feature has focused coverage across schema validation, rendering, interaction, review-package behavior, examples, and backward compatibility. Tests verify hidden content remains available for static, print, and review workflows.

## Verification Commands

```bash
npm run test -- tests/lecture-template/parseTemplate.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/advanced-components-interaction.test.tsx
npm run test -- tests/lecture-template/review-package.test.ts
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/backward-compat.test.tsx
npm run test -- tests/lecture-template/collection.test.ts
```

## Cleanup Notes

- Clear `localStorage` and restore mocked storage APIs between interaction tests.
- Remove generated review-package artifacts created by tests unless the test harness already writes them to ignored temporary paths.
- Do not add broad snapshots that make unrelated style or markup changes hard to review.
