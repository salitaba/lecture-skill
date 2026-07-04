# Task: Create Diagram React Component

## Goal

Create the `Diagram` component that renders Mermaid.js diagrams with a static `<pre>` fallback, accessible markup, figcaption, and collapsible source code.

## Dependencies

- `010-interactive-diagrams-flowcharts-01-dependency.md` (mermaid installed)
- `010-interactive-diagrams-flowcharts-02-types.md` (DiagramComponent type available)

## Exact Files To Create Or Modify

- `src/components/lecture-kit/Diagram.tsx` - New file: the diagram React component.

## Checklist

- [x] Add `"use client"` directive at top of file.
- [x] Import `DiagramComponent` from `@/lib/lecture-template/types`.
- [x] Import `useId`, `useEffect`, `useRef`, `useState` from React.
- [x] Accept `{ component: DiagramComponent }` props (same pattern as Callout).
- [x] Use `useId()` for a stable diagram element ID.
- [x] Render a `<figure>` with `role="img"`, `aria-label={component.title}`, `className="lecture-component diagram-card"`.
- [x] Render `<p className="component-label">Diagram</p>` inside the figure.
- [x] Render a `<div className="diagram-svg-container">` containing `<pre><code>{component.code}</code></pre>` as the no-JS fallback.
- [x] Render `<figcaption>{component.title}</figcaption>`.
- [x] Render `<details>` with `<summary>Diagram source code</summary>` and `<pre><code>{component.code}</code></pre>`.
- [x] In `useEffect`: dynamically import `mermaid`, catch import error.
- [x] If `window.mermaid` not yet initialized, call `mermaid.initialize({ startOnLoad: false })`.
- [x] Call `mermaid.render(diagramId, component.code, { theme: component.theme || 'default' })`.
- [x] On success: replace the `<pre>` inside `.diagram-svg-container` with the rendered SVG using `dangerouslySetInnerHTML` or a ref.
- [x] On render error: leave `<pre>` in place, add `<p className="diagram-error">Diagram could not be rendered. Showing source code.</p>`.
- [x] On import error: show `<p className="diagram-error">Diagram library failed to load. Showing source code.</p>`.
- [x] Use `useRef` for the container div to enable imperative SVG replacement.
- [x] Export the `Diagram` component as a named export.

## Expected Behavior

- Server/initial render produces accessible `<figure>` with `role="img"`, `aria-label`, figcaption, raw Mermaid code in `<pre>`, and collapsed `<details>` with source.
- Client-side: Mermaid.js is dynamically imported, diagram renders as SVG replacing the `<pre>`.
- If Mermaid fails to parse, the raw code remains visible with an error note.
- If Mermaid fails to load, all diagrams show the load failure note.
- Multiple diagram instances use unique IDs via `useId()`.

## Verification Commands

```bash
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify SectionRenderer, styles, or tests in this task.
- This component will not render in tests until SectionRenderer is wired in task 05.
