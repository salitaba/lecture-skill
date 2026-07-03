# 002 Improve UX - 06 Visual And Responsive Polish

## Goal

Strengthen the teaching-page visual hierarchy, supported component presentation, focus behavior, reduced-motion behavior, and overflow resilience without changing the template schema.

## Dependencies

- `002-improve-ux-04-header-navigation.md`
- `002-improve-ux-05-validation-screen.md`

## Exact Files To Create Or Modify

- `src/app/globals.css`
- `src/components/lecture-kit/PageShell.tsx`
- `src/components/lecture-kit/SectionRenderer.tsx`
- `src/components/lecture-kit/Callout.tsx`
- `src/components/lecture-kit/ConceptCard.tsx`
- `src/components/lecture-kit/StepList.tsx`
- `src/components/lecture-kit/CodeBlock.tsx`
- `src/components/lecture-kit/LectureHeader.tsx`
- `src/components/lecture-kit/SectionNavigation.tsx`
- `src/components/lecture-kit/ValidationScreen.tsx`
- `tests/lecture-template/lecture-components.test.tsx`
- `tests/lecture-template/renderMarkdown.test.tsx`

## Checklist

- [x] Refine global tokens and spacing into a restrained education-tool visual system.
- [x] Preserve readable prose line length while leaving room for code and tables to scroll internally.
- [x] Add `min-width: 0` where grid/flex children can otherwise create page-level overflow.
- [x] Ensure code blocks and Markdown tables use internal horizontal scrolling and do not create body-level overflow.
- [x] Add `scroll-margin-top` to anchor targets so sticky navigation/header spacing does not obscure headings.
- [x] Remove global smooth scrolling or wrap it in `@media (prefers-reduced-motion: no-preference)`.
- [x] Keep visible `:focus-visible` styles for links and buttons.
- [x] Add visible `summary:focus-visible` styles if the mobile nav uses `<summary>`.
- [x] Distinguish overview, objectives, authored sections, and takeaways by role with restrained borders, spacing, labels, and list styles.
- [x] Avoid nested-card clutter. Section surfaces and component surfaces should not both look like heavy floating cards.
- [x] Make `callout` variants visually distinct without relying on color alone.
- [x] Make `ConceptCard` visually distinct from callouts.
- [x] Improve `StepList` numbering and long-step wrapping.
- [x] Improve `CodeBlock` language label and long-line behavior.
- [x] Keep component markup semantic and do not introduce `dangerouslySetInnerHTML` or raw HTML rendering.
- [x] Update static tests where role labels, code labels, or expected component text changed intentionally.

## Expected Behavior

- The rendered lecture feels polished and scannable while remaining dense enough for teaching review.
- Overview, objectives, sections, components, and takeaways have recognizable roles.
- Long metadata, long section titles, long navigation labels, long code lines, and Markdown tables do not clip or overlap containers.
- Keyboard focus remains visible, including on a mobile navigation summary if present.
- Reduced-motion users are not forced into smooth scrolling.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx tests/lecture-template/renderMarkdown.test.tsx
npm run lint
npm run typecheck
```

## Cleanup Notes

- Do not replace `content/lecture.template.md` permanently.
- If manual preview creates `.next/`, leave it uncommitted.
