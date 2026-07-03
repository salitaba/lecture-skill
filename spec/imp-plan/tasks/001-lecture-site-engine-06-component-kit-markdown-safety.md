# 001 Lecture Site Engine - 06 Component Kit And Markdown Safety

## Goal

Implement the shared lecture component kit, safe Markdown rendering, and responsive layout behavior required for the MVP lecture page.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`
- `001-lecture-site-engine-03-validator.md`
- `001-lecture-site-engine-05-rendering-route-validation-screen.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/renderMarkdown.tsx`
- `src/components/lecture-kit/PageShell.tsx`
- `src/components/lecture-kit/LectureHeader.tsx`
- `src/components/lecture-kit/SectionNavigation.tsx`
- `src/components/lecture-kit/SectionRenderer.tsx`
- `src/components/lecture-kit/Callout.tsx`
- `src/components/lecture-kit/ConceptCard.tsx`
- `src/components/lecture-kit/StepList.tsx`
- `src/components/lecture-kit/CodeBlock.tsx`
- `src/components/lecture-kit/ValidationScreen.tsx`
- `src/app/globals.css`
- `tests/lecture-template/renderMarkdown.test.tsx` or equivalent rendering test

## Checklist

- [x] Keep all lecture-specific base UI implementation under `src/components/lecture-kit/`.
- [x] Implement `Callout` variants for `note`, `warning`, and `insight`.
- [x] Implement `ConceptCard`.
- [x] Implement `StepList`.
- [x] Implement `CodeBlock` for `code_block` lecture components.
- [x] Render regular fenced code blocks as normal Markdown content with horizontal scrolling inside the code container.
- [x] Render paragraphs, bullet lists, numbered lists, and tables when present in parsed Markdown.
- [x] Render supported `lecture-component` blocks only through the shared component-kit components.
- [x] Do not duplicate lecture component UI outside `src/components/lecture-kit/`.
- [x] Implement `renderMarkdown.tsx` without `dangerouslySetInnerHTML`.
- [x] Do not enable raw HTML rendering such as `rehype-raw` unless the implementation also sanitizes it.
- [x] Ensure raw HTML in lecture Markdown, including `<script>`, is escaped or rendered as inert text and cannot inject markup.
- [x] Add a Markdown safety test proving `<script>` or inline HTML cannot execute or inject unexpected markup.
- [x] Add responsive CSS for readable desktop and mobile layouts.
- [x] Ensure code blocks do not create page-level horizontal overflow.
- [x] Add visible focus styles for section navigation.
- [x] Use color contrast suitable for WCAG AA normal text.

## Expected Behavior

- Every supported MVP component type is visually distinguishable from normal body text.
- Markdown content renders safely through React components.
- Raw HTML cannot inject executable or unexpected markup.
- The page remains readable and avoids horizontal overflow at 390px and 1280px widths.
- Section navigation is keyboard usable with visible focus states.

## Verification Commands

```bash
npm run test -- tests/lecture-template/renderMarkdown.test.tsx
npm run test
npm run validate
npm run dev
```

Manually check the preview at 390px and 1280px viewport widths after valid content exists.

## Cleanup Notes

- Stop the dev server after manual checks.
- Do not commit screenshots, `.next/`, or coverage output unless the project intentionally stores them.
