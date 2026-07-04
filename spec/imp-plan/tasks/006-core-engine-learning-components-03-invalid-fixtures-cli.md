# Task: Invalid Fixtures And CLI Validation

**Goal**: Update reusable invalid examples and CLI assertions so fixture scanning and validation output reflect the newly supported component types.

**Dependencies**: `006-core-engine-learning-components-02-schema-validation-implementation.md`

## Exact Files To Create Or Modify

- `examples/invalid/unsupported-component-type.template.md` - Replace any now-supported type such as `quiz` with a genuinely unsupported type such as `flashcard` or `timeline`.
- `examples/invalid/` - Add focused invalid fixtures for malformed new component payloads.
- `tests/lecture-template/fixtures.test.ts` - Update expectations only if fixture naming or counts require it.
- `tests/lecture-template/validate-cli.test.ts` - Update unsupported-component CLI expectations and add CLI assertions for representative new component failures.
- `tests/lecture-template/validateTemplate.test.ts` - Add fixture-backed invalid assertions if not already covered by task 1.

## Checklist

- [x] Add a fixture for missing `comparison.title`.
- [x] Add a fixture for malformed or empty `comparison.items`.
- [x] Add a fixture covering comparison item field errors for `label`, `left`, and `right`.
- [x] Add a fixture for empty optional `comparison.left_label` or `comparison.right_label`.
- [x] Add a fixture for missing or empty `summary.items`.
- [x] Add a fixture for non-string or empty-string `summary.items` entries.
- [x] Add a fixture for missing `quote.quote`.
- [x] Add a fixture for empty optional `quote.attribution` or `quote.context`.
- [x] Add a fixture for `quiz.options` with fewer than two entries.
- [x] Add a fixture for non-string or empty quiz option entries.
- [x] Add a fixture for missing `quiz.answer` or an answer that does not exactly match a trimmed option.
- [x] Add a fixture for empty optional `quiz.explanation`.
- [x] Prefer coherent fixture files that can assert multiple related errors without becoming hard to read.
- [x] Keep all new component blocks inside `## Section:` blocks unless the fixture is specifically testing outside-section behavior.
- [x] Update `unsupported-component-type.template.md` and every assertion that names the old unsupported type.
- [x] Ensure CLI output still includes `UNSUPPORTED_COMPONENT_TYPE`, `component=...`, `section=Valid Section`, location, and supported-type hint text.
- [x] Ensure CLI output for representative nested failures includes precise fields such as `items[0].label`, `options[0]`, and `answer`.

## Expected Behavior

- `fixtures.test.ts` continues to auto-run every valid and invalid fixture successfully.
- The unsupported-component fixture remains intentionally invalid after `quiz` becomes supported.
- CLI validation output remains copyable into an AI-agent prompt and includes component, section, field, and location context.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validate-cli.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run validate
```

## Cleanup Notes

- Keep committed invalid fixtures under `examples/invalid/`.
- Do not leave temporary fixture directories or modified active `content/` or `lectures/` state after CLI tests.
- Restore `process.cwd()` and remove temp directories in tests that create isolated repositories.
