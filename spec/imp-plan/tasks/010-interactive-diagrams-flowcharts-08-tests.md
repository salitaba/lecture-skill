# Task: Write Validation And Rendering Tests

## Goal

Add focused tests for diagram validation (all valid/invalid cases), diagram rendering (accessible markup, fallback, source details), and SectionRenderer dispatch, while updating the hardcoded `supportedComponentTypes` array.

## Dependencies

- `010-interactive-diagrams-flowcharts-03-validation.md` (validation logic exists)
- `010-interactive-diagrams-flowcharts-04-diagram-component.md` (Diagram component exists)
- `010-interactive-diagrams-flowcharts-05-section-renderer.md` (SectionRenderer dispatches diagram)

## Exact Files To Create Or Modify

- `tests/lecture-template/validateTemplate.test.ts` - Add `"diagram"` to `supportedComponentTypes` array (line 5); add diagram validation tests.
- `tests/lecture-template/lecture-components.test.tsx` - Add diagram rendering tests (accessible markup, fallback, figcaption, source details, SectionRenderer dispatch).

## Checklist

### validateTemplate.test.ts

- [x] Add `"diagram"` to the `supportedComponentTypes` array (line 5).
- [x] Test valid diagram with each supported `diagram_type` (flowchart, sequence, class, state, er, gantt, pie, mindmap) — all should pass.
- [x] Test missing `diagram_type` error: error message contains `"diagram component requires a diagram_type field"`.
- [x] Test invalid `diagram_type` error: error message contains `"diagram_type must be one of"`.
- [x] Test missing `code` error: error message contains `"diagram component requires a code field"`.
- [x] Test empty `code` error: error message contains `"diagram code field must not be empty"`.
- [x] Test invalid `direction` error: error message contains `"direction must be one of: TB, LR, BT, RL"`.
- [x] Test `direction` on non-flowchart error: error message contains `"direction field is only valid for flowchart diagram_type"`.
- [x] Test invalid `theme` error: error message contains `"theme must be one of: default, dark, forest, neutral, base"`.
- [x] Test normalization of diagram component with defaults (no direction/theme → defaults to undefined).
- [x] Test normalization of diagram component with optional fields (direction and theme present).
- [x] Test diagram component outside section is invalid (same COMPONENT_OUTSIDE_SECTION error).

### lecture-components.test.tsx

- [x] Import `Diagram` from `../../src/components/lecture-kit/Diagram`.
- [x] Test Diagram renders accessible markup: `role="img"`, `aria-label` containing the title, `<figcaption>` containing the title.
- [x] Test Diagram renders raw Mermaid source in `<pre><code>` fallback.
- [x] Test Diagram renders `<details>` with `<summary>Diagram source code</summary>` and source code.
- [x] Test Diagram through SectionRenderer dispatch: render a section block with a diagram component and verify it renders the Diagram markup.
- [x] Test HTML escaping in diagram title (e.g., `<script>alert("xss")</script>` as title → escaped in rendered output).
- [x] Use `renderToStaticMarkup` from `react-dom/server` (consistent with existing tests).

## Expected Behavior

- All new validation tests pass.
- All new rendering tests pass.
- Existing tests remain unaffected.
- The `supportedComponentTypes` array reflects all 9 component types including `"diagram"`.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify production code in this task.
- Tests use `renderToStaticMarkup` which does not execute client-side effects (Mermaid rendering), so only the static fallback markup is tested.
