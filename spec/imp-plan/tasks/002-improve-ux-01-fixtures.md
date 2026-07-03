# 002 Improve UX - 01 Fixtures And Edge Cases

## Goal

Add reusable lecture fixtures that cover the UX edge cases required by the finalized plan: duplicate section titles, long metadata, long section titles, long code lines, Markdown tables, all supported component types, and at least 10 authored sections.

## Dependencies

- None.

## Exact Files To Create Or Modify

- `examples/ux-stress.template.md`
- `examples/invalid/ux-validation-mixed.template.md` only if existing invalid fixtures do not expose representative message, code, locator/context, field/heading/section/component, and hint data for validation screen tests
- `tests/lecture-template/fixtures.test.ts`
- `tests/lecture-template/render-model.test.ts`

## Checklist

- [x] Create one valid fixture, preferably `examples/ux-stress.template.md`, that remains within the existing template schema.
- [x] Include long `audience`, `duration`, and `level`-adjacent metadata values where the schema permits them. Do not invent new frontmatter fields.
- [x] Include at least 10 authored `## Section` entries.
- [x] Include duplicate authored section titles so unique section anchors are exercised.
- [x] Include at least one intentionally long authored section title.
- [x] Include a long code line inside a supported `code_block` component.
- [x] Include a Markdown table in normal section content.
- [x] Include all supported component types: `callout`, `concept_card`, `step_list`, and `code_block`.
- [x] Include all `callout` variants currently supported by the validator.
- [x] Add the new valid fixture to `tests/lecture-template/fixtures.test.ts` so it must pass validation.
- [x] Add or update render-model assertions proving duplicate section titles in the UX fixture produce unique anchors.
- [x] Add `examples/invalid/ux-validation-mixed.template.md` only if the current invalid fixture set cannot support validation screen tests with error message, code, template path, best available location/context, and hint assertions.

## Expected Behavior

- The UX stress fixture validates successfully.
- The fixture can be copied to `content/lecture.template.md` for manual responsive checks without changing the parser, validator, or template schema.
- Duplicate section titles still result in distinct authored-section anchors.
- Any added invalid fixture fails validation and exposes enough structured error data for validation screen rendering tests.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts tests/lecture-template/render-model.test.ts
```

## Cleanup Notes

- Do not replace `content/lecture.template.md` as part of this task.
- If you temporarily copy `examples/ux-stress.template.md` into `content/lecture.template.md` while debugging, restore the original active template before finishing.
- Do not commit `.next/`, coverage output, or temporary copied fixtures.
