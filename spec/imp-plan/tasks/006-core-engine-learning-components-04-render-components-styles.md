# Task: Component Rendering And Styles

**Goal**: Add accessible React renderers and responsive styles for `comparison`, `summary`, `quote`, and `quiz`, then wire them through `SectionRenderer`.

**Dependencies**: `006-core-engine-learning-components-02-schema-validation-implementation.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/Comparison.tsx` - Create the comparison component.
- `src/components/lecture-kit/Summary.tsx` - Create the summary component.
- `src/components/lecture-kit/Quote.tsx` - Create the quote component.
- `src/components/lecture-kit/Quiz.tsx` - Create the quiz component.
- `src/components/lecture-kit/SectionRenderer.tsx` - Import and dispatch the new components.
- `src/app/globals.css` - Add responsive component styles.
- `src/components/lecture-kit/Callout.tsx`, `ConceptCard.tsx`, `StepList.tsx`, `CodeBlock.tsx` - Read for local patterns; modify only if a small shared pattern is clearly needed.

## Checklist

- [x] Implement `Comparison` using the normalized `ComparisonComponent` model.
- [x] Render comparison title, left/right labels, and every item label/value in an accessible structure.
- [x] Use a semantic table only if CSS keeps labels visible and avoids body-level horizontal overflow; otherwise use a responsive grid or stacked row layout.
- [x] Implement `Summary` as a concise recap block with a heading and bullet list.
- [x] Keep summary styling distinct from `Callout` and less visually dominant than final `Key Takeaways`.
- [x] Implement `Quote` with semantic `blockquote` markup.
- [x] Render quote attribution visually connected to the quote when present.
- [x] Render quote context as supporting prose outside the quoted text.
- [x] Implement `Quiz` as a static teaching check with question, options, clearly labeled answer area, and optional explanation.
- [x] Do not add client-side state or JavaScript-dependent reveal behavior for P0/P1.
- [x] Rely on React escaping and do not use `dangerouslySetInnerHTML`.
- [x] Use existing visual vocabulary such as `component-label`, compact card layout, and 8px card radii.
- [x] Replace the current `SectionRenderer` component `if` chain with a `switch (component.type)`.
- [x] Add an `assertNever(component)` fallback so future union members are not silently dropped.
- [x] Add CSS classes for all four new components in `src/app/globals.css`.
- [x] Ensure long labels, long quote text, and long quiz options wrap with `min-width: 0` or equivalent constraints.
- [x] Preserve `body { overflow-x: clip; }` and avoid component styles that create body-level horizontal overflow.

## Expected Behavior

- Valid new component models render through `SectionRenderer` in both single-lecture and collection pages.
- The rendered output is static-export friendly and does not depend on network access or runtime interactivity.
- Long content wraps cleanly at phone, tablet, and desktop widths.
- Unknown future component union members fail at compile time instead of rendering `null`.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run build
```

Manual responsive smoke command:

```bash
npm run dev
```

Check a lecture containing all supported components at 390px, 768px, and 1280px and confirm:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

## Cleanup Notes

- Stop the dev server after manual verification.
- Do not introduce external UI libraries or browser-only behavior.
- Do not change route files unless a renderer defect proves they are involved.
