# 001 Lecture Site Engine - 07 Content And Example Artifacts

## Goal

Create the valid active template, golden source/reference template, component demo, recommended raw-source placeholder, and committed invalid fixtures required by the spec and plan.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`
- `001-lecture-site-engine-03-validator.md`
- `001-lecture-site-engine-04-validation-fixtures-cli.md`
- `001-lecture-site-engine-06-component-kit-markdown-safety.md`

## Exact Files To Create Or Modify

- `examples/raw-lecture.txt`
- `examples/golden.template.md`
- `examples/component-demo.template.md`
- `examples/invalid/*.template.md`
- `content/lecture.template.md`
- `content/raw-lecture.txt`
- `tests/lecture-template/fixtures.test.ts` or equivalent fixture validation tests

## Checklist

- [x] Create `examples/raw-lecture.txt` as one realistic plain-English lecture source of roughly 500-4,000 words.
- [x] Ensure the raw lecture naturally supports at least one useful visual component through an idea, process, caveat, code example, or concept.
- [x] Create `examples/golden.template.md` as a valid template generated from the raw source for reviewer comparison after generation.
- [x] Create `content/lecture.template.md` as a valid active render input for immediate preview.
- [x] If `content/lecture.template.md` matches or closely reveals the golden template, make sure later documentation and launch records explicitly require sanitizing it before golden evaluation.
- [x] Create `examples/component-demo.template.md` as a parse-valid template demonstrating:
  - [x] `callout`
  - [x] `concept_card`
  - [x] `step_list`
  - [x] `code_block`
- [x] Create `content/raw-lecture.txt` as the recommended working path for non-golden raw lecture sources, with placeholder guidance if desired.
- [x] Ensure invalid fixtures under `examples/invalid/` cover every P0 invalid case listed in the finalized plan.
- [x] Keep invalid fixture filenames descriptive enough for a reviewer to map them to P0 requirements.
- [x] Add tests proving valid example templates pass validation.
- [x] Add tests proving all invalid fixtures fail validation.
- [x] Do not make README examples or `SKILL.md` content derive from the golden lecture; that belongs to the docs task.

## Expected Behavior

- `content/lecture.template.md` passes `npm run validate` and can render a complete lecture page.
- `examples/golden.template.md` passes validation and can be used only as a post-generation reviewer reference.
- `examples/component-demo.template.md` passes validation and demonstrates all supported MVP component types.
- Invalid fixtures are committed, descriptive, and connected to automated validation coverage.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test
```

Optionally copy `examples/component-demo.template.md` to `content/lecture.template.md`, run `npm run validate`, and preview it, then restore the original active template.

## Cleanup Notes

- If copying demo fixtures over `content/lecture.template.md`, preserve and restore the active template afterward.
- Do not leave reviewer-only golden comparison copies inside the agent-accessible workspace during later golden conversion runs.
