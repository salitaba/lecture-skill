# Task: Collection Landing Page Component

**Goal**: Create the `CollectionLanding` server component that renders the course outline page listing all lectures.

**Dependencies**: Task 1 (collection types must exist)

## Files to Create/Modify

- `src/components/lecture-kit/CollectionLanding.tsx` — New component

## Checklist

### CollectionLanding.tsx creation
- [ ] Define props: `{ validation: CollectionValidationResult }`
- [ ] Render `<h1>` with collection title (derived from lecture count, e.g., "Lecture Collection")
- [ ] Render summary: total lecture count and estimated total duration derived from lecture `duration` metadata
- [ ] Render ordered list of lectures (`<ol>` with class `lecture-list`)
- [ ] Each list item shows:
  - [ ] Lecture number and title as a link to `/lectures/{slug}`
  - [ ] Description text
  - [ ] Metadata: audience, level, duration
  - [ ] Section count from the template
  - [ ] Validation status badge: "PASS" or "FAIL" text (not color-only)
- [ ] Use semantic HTML: `<article>` for each lecture entry, `<dl>` for metadata
- [ ] Links use plain `<a>` tags pointing to `/lectures/{slug}`
- [ ] Give the landing page and list items stable class hooks that the shared style task will target: `.collection-landing`, `.collection-header`, `.collection-summary`, `.lecture-list`, `.lecture-list-item`, `.lecture-list-meta`, `.lecture-list-link`, `.validation-badge`, `.validation-badge-pass`, `.validation-badge-fail`

## Expected Behavior

- All lectures listed in authored order (sorted by numeric prefix)
- Each lecture links to its per-lecture route
- Validation status visible per lecture
- No horizontal overflow at 390px, 768px, 1280px
- Keyboard navigable with visible focus states

## Verification

```bash
npm run typecheck
npm run lint
```

## Notes

- The `CollectionLanding` does NOT need `"use client"` — it's a server component
- Duration values are strings like "45 minutes" — parse the minute value from each lecture and sum it for the course summary
- Validation badge uses text + icon (checkmark/cross Unicode) to avoid color-only indication
- Shared CSS for the collection layout lives in Task 8
