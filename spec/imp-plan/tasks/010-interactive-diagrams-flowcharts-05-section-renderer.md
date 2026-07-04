# Task: Wire Diagram Into SectionRenderer

## Goal

Import the `Diagram` component into `SectionRenderer.tsx` and add a `"diagram"` case to the component switch so diagram blocks render through the standard dispatch.

## Dependencies

- `010-interactive-diagrams-flowcharts-04-diagram-component.md` (Diagram component exists)
- `010-interactive-diagrams-flowcharts-03-validation.md` (diagram is a validated type)

## Exact Files To Create Or Modify

- `src/components/lecture-kit/SectionRenderer.tsx` - Import `Diagram`, add `case "diagram":` to switch.

## Checklist

- [x] Add `import { Diagram } from "./Diagram";` at the top with other component imports (line 3-10).
- [x] Add `case "diagram":` returning `<Diagram key={index} component={component} />` in the switch statement (line 31-50), before the `default: assertNever(component)` case.
- [x] Confirm the `assertNever` exhaustiveness check still compiles (no TypeScript error).

## Expected Behavior

- TypeScript compiles without errors; the `assertNever` check confirms all union members are handled.
- When a validated lecture template contains a diagram component, it renders through the same dispatch path as other components.

## Verification Commands

```bash
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not add or modify tests, styles, or docs in this task.
