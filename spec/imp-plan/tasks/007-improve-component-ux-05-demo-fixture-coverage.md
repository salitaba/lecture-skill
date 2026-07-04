# Task: Demo Fixture And Collection Coverage

## Goal

Add automated coverage proving the component demo remains valid and contains the exact supported component set in single-lecture and collection-oriented test paths.

## Dependencies

- `007-improve-component-ux-03-component-demo-gallery.md`
- `007-improve-component-ux-04-rendering-tests.md` is independent but should be complete before broad verification.

## Exact Files To Create Or Modify

- `tests/lecture-template/validateTemplate.test.ts` - Keep demo validity coverage and add exact component set/count coverage for `examples/component-demo.template.md`.
- `tests/lecture-template/collection.test.ts` - Extend collection-mode model assertions to include all eight component types from the component demo.
- `tests/lecture-template/validate-collection-cli.test.ts` - Extend only if CLI-level collection coverage is the better local fit for asserting the demo path.
- `tests/lecture-template/fixtures.test.ts` - Keep fixture sweep green after demo changes; modify only if existing fixture expectations need to name the component demo.
- `examples/component-demo.template.md` - Modify only to fix defects found by the tests.

## Checklist

- [ ] Keep the existing assertion that `examples/component-demo.template.md` validates successfully.
- [ ] Add or extend a fixture/model assertion that parses `examples/component-demo.template.md` and extracts all component types.
- [ ] Assert the exact supported component set is present: `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, and `quiz`.
- [ ] Assert the count or set so future demo edits cannot accidentally drop `quiz` or another supported component.
- [ ] Extend collection-mode fixture coverage so it checks all eight component types, not only `comparison`, `summary`, `quote`, and `quiz`.
- [ ] Keep assertions tied to the existing parser/model helpers; do not add a new parsing architecture.
- [ ] Do not change validation semantics or add new supported component types.

## Expected Behavior

- The component demo is validated as a fixture and as the canonical all-components gallery.
- Tests fail if any of the eight supported component types is removed from the demo.
- Collection-oriented coverage proves the demo component set still works through collection workflows without package-specific logic.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
```

## Cleanup Notes

- These tests should not create persistent test data.
- If a test creates temporary collection directories or files through existing helpers, ensure the existing helper cleanup still removes them.
- Do not leave a modified `content/lecture.template.md` from manual demo preview.
