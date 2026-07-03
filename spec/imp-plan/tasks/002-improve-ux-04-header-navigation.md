# 002 Improve UX - 04 Header And Learning Path Navigation

## Goal

Improve the first-viewport lecture dashboard and replace the authored-section-only navigation with a complete, compact learning path that works on desktop and mobile without client-side active tracking.

## Dependencies

- `002-improve-ux-03-anchor-route-contract.md`

## Exact Files To Create Or Modify

- `src/app/page.tsx`
- `src/components/lecture-kit/LectureHeader.tsx`
- `src/components/lecture-kit/SectionNavigation.tsx`
- `src/app/globals.css`
- `tests/lecture-template/lecture-components.test.tsx`

## Checklist

- [x] Derive `sectionCount` from `lecture.sections.length` in `src/app/page.tsx` and pass it to `LectureHeader`.
- [x] Update `LectureHeader` to render title and description as the strongest first-viewport content without creating a tall marketing-style hero.
- [x] Render audience, duration, level, and authored-section count as compact metadata badges or definition-list items that wrap cleanly.
- [x] Update `SectionNavigation` to render a complete learning path:
  - Overview
  - Learning Objectives
  - every authored section with visible section number
  - Key Takeaways
- [x] Make long navigation labels wrap without clipping or overlap.
- [x] Keep desktop navigation sticky.
- [x] Use a compact mobile navigation pattern, preferably native `<details>` / `<summary>` labeled "Learning path".
- [x] If `<details>` / `<summary>` is used, ensure the summary is keyboard reachable and has explicit visible focus styling in CSS.
- [x] Keep all nav items as normal `<a>` anchors.
- [x] Explicitly do not set `aria-current`, because actual active-section tracking is deferred.
- [x] Update or add tests for section count, complete nav destinations, visible section numbering, and absence of `aria-current`.

## Expected Behavior

- A reviewer can identify the title, purpose, audience, duration, level, and section count in the first viewport at desktop width.
- A reviewer can predict the full lesson structure before reading the first authored section.
- Mobile users are not forced through a long expanded static navigation block before reaching lecture content.
- Navigation remains useful with JavaScript disabled because it is plain anchor markup.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run lint
npm run typecheck
```

## Cleanup Notes

- No active template replacement is required.
- If manual preview is used while implementing, stop `npm run dev` afterward and do not commit `.next/`.
