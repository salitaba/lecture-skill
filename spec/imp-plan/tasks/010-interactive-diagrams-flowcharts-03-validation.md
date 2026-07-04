# Task: Add Diagram Validation

## Goal

Add `"diagram"` to the supported component list and implement validation for `diagram_type`, `code`, `direction`, and `theme` fields with clear error messages.

## Dependencies

- `010-interactive-diagrams-flowcharts-02-types.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/validateTemplate.ts` - Add diagram to `supportedComponents`, add validation in `validateComponent`, add normalization in `normalizeComponent`.

## Checklist

- [x] Add `"diagram"` to the `supportedComponents` array (line 17-26).
- [x] Import `DiagramType`, `DiagramDirection`, `DiagramTheme` from `types.ts`.
- [x] Define `allowedDiagramTypes: DiagramType[]` with all 8 values.
- [x] Define `allowedDiagramDirections: DiagramDirection[]` with `TB`, `LR`, `BT`, `RL`.
- [x] Define `allowedDiagramThemes: DiagramTheme[]` with `default`, `dark`, `forest`, `neutral`, `base`.
- [x] In `validateComponent`, add `if (type === "diagram")` block after the `quiz` block (line 307-323).
- [x] Call `requireStringFields(block, sectionTitle, errors, ["title", "code"])` for diagram.
- [x] Validate `diagram_type` is present and in `allowedDiagramTypes`. Use error message: `"diagram_type must be one of: flowchart, sequence, class, state, er, gantt, pie, mindmap."`
- [x] Validate `code` is non-empty after trimming. Use error message: `"diagram code field must not be empty."`
- [x] Validate `direction` if present: must be in `allowedDiagramDirections`. Error: `"direction must be one of: TB, LR, BT, RL."`
- [x] Validate `direction` on non-flowchart: error `"direction field is only valid for flowchart diagram_type."`
- [x] Validate `theme` if present: must be in `allowedDiagramThemes`. Error: `"theme must be one of: default, dark, forest, neutral, base."`
- [x] In `normalizeComponent`, add `if (data.type === "diagram")` block that returns a `DiagramComponent` with defaults (direction defaults to undefined, theme defaults to undefined).
- [x] Update `supportedComponentHint()` if it references the array (it does via `supportedComponents.join(", ")`).

## Expected Behavior

- A valid diagram component with `type`, `diagram_type`, `title`, and `code` passes validation.
- Missing `diagram_type`, invalid `diagram_type`, missing `code`, empty `code`, invalid `direction`, invalid `theme`, and `direction` on non-flowchart all produce specific error messages.
- The component normalizes to a `DiagramComponent` with correct field types.
- Existing component validation is unaffected.

## Verification Commands

```bash
npm run typecheck
npm run test -- tests/lecture-template/validateTemplate.test.ts
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify rendering, components, or examples in this task.
