# Task: Add Advanced Component Examples And Invalid Fixtures

## Goal

Update valid demos, collection examples, and invalid fixtures so every advanced component has concrete authoring coverage.

## Dependencies

- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`
- `013-advanced-ui-engine-components-05-instructor-review-package.md`

## Exact Files To Create Or Modify

- `examples/component-demo.template.md` - Add valid demo coverage for all ten advanced components while preserving existing component gallery coverage.
- `examples/multi-lecture/lectures/01-introduction/lecture.template.md` or `examples/multi-lecture/lectures/02-core-concepts/lecture.template.md` - Add at least five new components to one collection lecture.
- `examples/invalid/advanced-glossary-field-errors.template.md` - Add glossary invalid-field cases.
- `examples/invalid/advanced-tabs-field-errors.template.md` - Add tabs list, duplicate label, and invalid `default_tab` cases.
- `examples/invalid/advanced-accordion-field-errors.template.md` - Add accordion item, duplicate title with `default_open`, and invalid `default_open` cases.
- `examples/invalid/advanced-timeline-field-errors.template.md` - Add timeline item and invalid `orientation` cases.
- `examples/invalid/advanced-checklist-field-errors.template.md` - Add checklist empty item/list and invalid `storage` cases.
- `examples/invalid/advanced-flashcard-field-errors.template.md` - Add flashcard required/optional string cases.
- `examples/invalid/advanced-worked-example-field-errors.template.md` - Add worked example required and list-minimum cases.
- `examples/invalid/advanced-mistake-correction-field-errors.template.md` - Add mistake correction required/optional string cases.
- `examples/invalid/resource-links-invalid-url.template.md` - Add unsafe, empty, protocol-relative, and malformed URL cases.
- `examples/invalid/advanced-instructor-note-field-errors.template.md` - Add body required field and invalid `audience` cases.
- `tests/lecture-template/fixtures.test.ts` - Update fixture expectations only if the fixture sweep needs explicit case names.

## Checklist

- [x] Add one valid `glossary_term`, `checklist`, `worked_example`, `mistake_correction`, `tabs`, `accordion`, `flashcard`, `resource_links`, `timeline`, and `instructor_note` to the component demo.
- [x] Keep authored components inside `## Section:` blocks.
- [x] Add at least five new components to one multi-lecture fixture so collection-route rendering has evidence.
- [x] Keep examples educational and aligned with technical lecture content; do not add unsupported component types or raw HTML.
- [x] Add invalid fixtures for missing required strings for every component family.
- [x] Add invalid fixtures for empty list minimums for tabs, accordion items, timeline items, checklist items, worked example walkthrough, resource links, and aliases where applicable.
- [x] Add invalid fixtures for duplicate tab labels and invalid `default_tab`.
- [x] Add invalid fixtures for invalid `default_open` references and duplicate accordion item titles when `default_open` is present.
- [x] Add invalid fixtures for invalid `timeline.orientation`, invalid `checklist.storage`, invalid resource URL schemes, and invalid `instructor_note.audience`.
- [x] Use specific fixture filenames so failures are easy to locate.

## Expected Behavior

The fixture sweep validates the component demo and collection fixtures, and rejects invalid advanced component examples with clear validation errors. Existing fixtures continue to pass or fail for their original reasons.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run validate
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify production render or validation code except to fix fixture-discovered defects from earlier tasks.
