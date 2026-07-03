# 001 Lecture Site Engine - 04 Fixtures, Tests, And CLI Validation

## Goal

Create reusable validation coverage for every P0 invalid case and wire `npm run validate` to validate the active template with author-locatable CLI output.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`
- `001-lecture-site-engine-03-validator.md`

## Exact Files To Create Or Modify

- `scripts/validate.ts`
- `tests/lecture-template/validate-cli.test.ts`
- `tests/lecture-template/fixtures.test.ts` or equivalent fixture-driven test file
- `examples/invalid/missing-frontmatter-title.template.md`
- `examples/invalid/empty-frontmatter-field.template.md`
- `examples/invalid/invalid-level.template.md`
- `examples/invalid/missing-required-sections.template.md`
- `examples/invalid/out-of-order-headings.template.md`
- `examples/invalid/duplicate-singleton-heading.template.md`
- `examples/invalid/content-before-overview.template.md`
- `examples/invalid/empty-overview.template.md`
- `examples/invalid/empty-learning-objectives.template.md`
- `examples/invalid/empty-key-takeaways.template.md`
- `examples/invalid/empty-section-title.template.md`
- `examples/invalid/section-without-meaningful-content.template.md`
- `examples/invalid/component-outside-section.template.md`
- `examples/invalid/unsupported-component-type.template.md`
- `examples/invalid/invalid-callout-variant.template.md`
- `examples/invalid/missing-component-field.template.md`
- `examples/invalid/empty-step-list-steps.template.md`
- `examples/invalid/invalid-frontmatter-yaml.template.md`
- `examples/invalid/malformed-component-yaml.template.md`
- `examples/invalid/unclosed-lecture-component-fence.template.md`

## Checklist

- [x] Replace the scaffolded `scripts/validate.ts` with the real validator entry point.
- [x] Make the CLI validate `content/lecture.template.md` by default.
- [x] Print a success message and exit `0` when the active template is valid.
- [x] Print every detected validation error and exit nonzero when validation fails.
- [x] Include field, heading, section, component type, locator, and remediation hints in CLI output when available.
- [x] Keep the CLI and `src/app/page.tsx` on the same parser/validator path, with no separate validation logic.
- [x] Add invalid fixture templates whose filenames map directly to P0 requirements.
- [x] Add fixture-driven tests proving each invalid fixture fails for the intended reason.
- [x] Add explicit locator tests for:
  - [x] invalid frontmatter YAML
  - [x] malformed component YAML
  - [x] unclosed `lecture-component` fence
  - [x] invalid component payload inside a named section
  - [x] non-empty content before `Overview`
  - [x] empty section title
- [x] Add CLI tests that run the validation script against valid and invalid fixture inputs without relying on the browser.
- [x] Ensure CLI tests assert exit code and printed field/section/component/locator/hint content.

## Expected Behavior

- `npm run validate` validates `content/lecture.template.md`, prints useful author-locatable results, and exits nonzero on failure.
- P0 invalid cases are reusable as committed fixtures and automated tests.
- A technical author can locate invalid fields, sections, components, YAML errors, and unclosed fences from CLI output without reading parser source.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/validate-cli.test.ts
npm run test
```

If the CLI test supports fixture-path arguments internally, also verify at least one valid fixture and one invalid fixture through the same script path.

## Cleanup Notes

- CLI tests that create temporary active templates must use a temp directory or restore the original `content/lecture.template.md` in test cleanup.
- Do not leave generated temp templates in `content/` or `examples/invalid/`.
