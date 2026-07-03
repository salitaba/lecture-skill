# Task: Next/Previous Navigation Component

**Goal**: Create the `LectureNavigation` component that provides next/previous lecture links and a "Back to course" link.

**Dependencies**: Task 2 (LecturePage extraction must exist for per-lecture route to use it)

## Files to Create/Modify

- `src/components/lecture-kit/LectureNavigation.tsx` — New component

## Checklist

### LectureNavigation.tsx creation
- [ ] Define `NavTarget` type: `{ slug: string; title: string }`
- [ ] Define props: `{ previous?: NavTarget; next?: NavTarget }`
- [ ] Render a `<nav>` element with `aria-label="Lecture navigation"`
- [ ] Render "Previous" link: `<a href="/lectures/{slug}">← {title}</a>` — only if `previous` is defined
- [ ] Render "Back to course" link: `<a href="/">Back to course</a>` — always visible
- [ ] Render "Next" link: `<a href="/lectures/{slug}">{title} →</a>` — only if `next` is defined
- [ ] Use semantic structure: the three links are siblings inside the nav
- [ ] Give the wrapper and links stable class hooks that the shared style task will target: `.lecture-nav`, `.lecture-nav-inner`, `.lecture-nav-link`, `.lecture-nav-back`

## Expected Behavior

- First lecture: shows only "Next" and "Back to course"
- Last lecture: shows only "Previous" and "Back to course"
- Middle lectures: shows all three links
- "Back to course" always links to `/`
- All links keyboard navigable with visible focus states
- No horizontal overflow at any required viewport width

## Verification

```bash
npm run typecheck
npm run lint
```

## Notes

- Use plain `<a>` tags (server-rendered, no client-side routing)
- The component does NOT use `"use client"` — it's a server component
- Arrow symbols (← →) are used for directional cues alongside text
- Focus states and responsive styling are handled in the shared collection styles task
