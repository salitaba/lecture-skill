# Task: Add DiagramComponent Type And Union Types

## Goal

Define `DiagramType`, `DiagramDirection`, `DiagramTheme`, and `DiagramComponent` in the type system, and add `"diagram"` to `LectureComponentType` and `LectureComponent` unions.

## Dependencies

- `010-interactive-diagrams-flowcharts-01-dependency.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts` - Add new types and interface; update unions.

## Checklist

- [x] Define `type DiagramType = "flowchart" | "sequence" | "class" | "state" | "er" | "gantt" | "pie" | "mindmap"` (export).
- [x] Define `type DiagramDirection = "TB" | "LR" | "BT" | "RL"` (export).
- [x] Define `type DiagramTheme = "default" | "dark" | "forest" | "neutral" | "base"` (export).
- [x] Add `DiagramComponent` interface with `type: "diagram"`, `diagram_type: DiagramType`, `title: string`, `code: string`, optional `direction?: DiagramDirection`, optional `theme?: DiagramTheme`.
- [x] Add `"diagram"` to the `LectureComponentType` union (line 11).
- [x] Add `DiagramComponent` to the `LectureComponent` union (line 234-242).

## Expected Behavior

- TypeScript compiles without errors.
- The `DiagramComponent` interface is exported and available for use in validation and rendering.
- Existing components and unions remain unchanged.

## Verification Commands

```bash
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify validation, rendering, or tests in this task.
