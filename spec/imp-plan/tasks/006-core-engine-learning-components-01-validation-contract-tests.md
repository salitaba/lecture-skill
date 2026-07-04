# Task: Validation Contract Tests

**Goal**: Add focused tests that define validation, normalization, and error-reporting behavior for `comparison`, `summary`, `quote`, and `quiz` before implementation.

**Dependencies**: None

## Exact Files To Create Or Modify

- `tests/lecture-template/validateTemplate.test.ts` - Add direct valid/invalid component validation tests and normalized model assertions.
- `tests/lecture-template/render-model.test.ts` - Modify only if model-level normalization assertions fit existing coverage better than `validateTemplate.test.ts`.
- `tests/lecture-template/backward-compat.test.tsx` - Modify only to preserve explicit regression coverage for existing templates.

## Checklist

- [x] Add valid inline-template coverage for all four new component types inside `## Section:` blocks.
- [x] Assert normalized `comparison` models use camelCase `leftLabel` and `rightLabel`.
- [x] Assert `comparison.leftLabel` defaults to `Option A` and `comparison.rightLabel` defaults to `Option B` when `left_label` and `right_label` are absent.
- [x] Assert authored `left_label` and `right_label` override the defaults after trimming.
- [x] Assert `comparison.items` preserves item order and trims `label`, `left`, and `right`.
- [x] Assert `summary.items` preserves order and trims each string.
- [x] Assert `quote` preserves optional `attribution` and `context` only when present and non-empty.
- [x] Assert `quiz.options` preserves authored order, trims options, and accepts an `answer` that exactly matches one trimmed option.
- [x] Add invalid inline-template tests for representative field paths: `items`, `items[0].label`, `items[0].left`, `items[0].right`, `options`, `options[0]`, and `answer`.
- [x] Assert validation errors include `componentType`, `field`, `sectionTitle`, `locator`, and useful `hint` values for nested comparison and quiz failures.
- [x] Preserve the existing `COMPONENT_OUTSIDE_SECTION` behavior for all component types.
- [x] Confirm existing valid templates still validate without changing their normalized output.

## Expected Behavior

- The tests describe the finalized schema contract for the four new learning components.
- Invalid new component payloads fail with author-locatable validation errors.
- Valid new component payloads normalize to renderable `LectureComponent` models with trimmed string values.
- Existing component behavior remains unchanged.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
npm run test -- tests/lecture-template/backward-compat.test.tsx
```

## Cleanup Notes

- Keep inline tests self-contained unless reusable committed fixtures are needed by a later fixture task.
- Do not write temporary files outside `mkdtempSync(os.tmpdir())` if a test needs filesystem state.
- Restore `process.cwd()` and remove temp directories in `afterEach` for any filesystem-based test.
