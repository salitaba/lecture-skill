# Task: Add Diagram CSS Styles

## Goal

Add responsive, overflow-safe, print-friendly CSS for the diagram component matching the existing lecture-kit card system.

## Dependencies

- `010-interactive-diagrams-flowcharts-04-diagram-component.md` (Diagram component defines the class names)

## Exact Files To Create Or Modify

- `src/app/globals.css` - Add `.diagram-card`, `.diagram-svg-container`, `.diagram-svg-container svg`, `.diagram-error`, and print styles.

## Checklist

- [x] Add `.diagram-card` style: inherits `.lecture-component` styling (the figure already has `className="lecture-component diagram-card"`); add `contain: inline-size` for overflow containment (same pattern as `.code-block`).
- [x] Add `.diagram-svg-container`: `width: 100%; max-width: 100%; overflow-x: auto`.
- [x] Add `.diagram-svg-container svg`: `width: 100%; height: auto`.
- [x] Add `.diagram-error`: muted color, small font size, top margin for error notes.
- [x] Add print styles in `@media print`: `.diagram-card` gets `break-inside: avoid`.
- [x] Place diagram styles near existing component styles (after `.code-block` or similar) for discoverability.

## Expected Behavior

- Diagrams scale to fit container width without horizontal overflow at 390px, 768px, and 1280px widths.
- The SVG rendered by Mermaid scales responsively via `width: 100%; height: auto`.
- Print output avoids breaking diagrams across pages.
- Error notes appear styled and muted.
- Existing component styles are unaffected.

## Verification Commands

```bash
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify components, tests, or docs in this task.
