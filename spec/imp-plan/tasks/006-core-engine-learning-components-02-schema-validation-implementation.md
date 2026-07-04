# Task: Schema And Validation Implementation

**Goal**: Extend the template type model, validation rules, meaningful-content detection, and normalization logic for the four new learning components.

**Dependencies**: `006-core-engine-learning-components-01-validation-contract-tests.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts` - Add component types and interfaces for `comparison`, `summary`, `quote`, and `quiz`.
- `src/lib/lecture-template/validateTemplate.ts` - Add supported type detection, field validation, nested field paths, meaningful-section handling, and normalization.
- `tests/lecture-template/validateTemplate.test.ts` - Adjust only as needed to keep the contract tests aligned with the implementation.
- `tests/lecture-template/render-model.test.ts` - Adjust only if normalization assertions live here.

## Checklist

- [x] Extend `LectureComponentType` with `comparison`, `summary`, `quote`, and `quiz`.
- [x] Add `ComparisonComponent`, `ComparisonItem`, `SummaryComponent`, `QuoteComponent`, and `QuizComponent` interfaces.
- [x] Extend the `LectureComponent` union with the new interfaces.
- [x] Add the new types to `supportedComponents` in deterministic hint order.
- [x] Update unsupported-component hints so they list every supported component type.
- [x] Add small helper functions for repeated validation of required strings, optional non-empty strings, non-empty string lists, and comparison item records where they reduce duplication.
- [x] Validate `comparison.title` as a non-empty string.
- [x] Validate `comparison.items` as a non-empty YAML list of mappings.
- [x] Validate each comparison item has non-empty `label`, `left`, and `right` fields with precise paths such as `items[0].label`.
- [x] Validate optional `comparison.left_label` and `comparison.right_label` as non-empty strings when present.
- [x] Validate `summary.title` as a non-empty string and `summary.items` as a non-empty list of non-empty strings.
- [x] Validate `quote.quote` as a non-empty string and optional `attribution` and `context` as non-empty strings when present.
- [x] Validate `quiz.question` as a non-empty string.
- [x] Validate `quiz.options` contains at least two non-empty strings.
- [x] Validate `quiz.answer` is a non-empty string that exactly matches one trimmed option.
- [x] Validate optional `quiz.explanation` as a non-empty string when present.
- [x] Keep component-block locators at the fence while making nested `field` paths precise.
- [x] Treat valid new components as meaningful section content in `isMeaningfulSectionBlock`.
- [x] Extend `normalizeComponent()` for the new types.
- [x] Trim all normalized string values, including nested comparison items, summary items, quiz options, and quiz answer.
- [x] Default `comparison.leftLabel` to `Option A` and `comparison.rightLabel` to `Option B`.
- [x] Do not normalize invalid component payloads into renderable models.

## Expected Behavior

- Valid templates using the four new component types pass validation and produce typed normalized render models.
- Invalid payloads fail before rendering, with section and component context suitable for author fixes.
- Components outside `## Section:` blocks still fail with `COMPONENT_OUTSIDE_SECTION`.
- Single-lecture and collection validation continue to use the same normalized `LectureTemplate` model.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
npm run typecheck
```

## Cleanup Notes

- Do not add parser grammar changes unless contract tests expose a concrete parser location/context gap.
- Keep validation behavior local to `validateTemplate.ts`; do not introduce a plugin registry or open-ended schema system.
