# Task: Per-Lecture Dynamic Route

**Goal**: Create the `/lectures/[slug]` dynamic route that renders individual lectures from the collection with next/previous navigation.

**Dependencies**: Tasks 1, 2, 3 (collection scanning, LecturePage extraction, navigation component)

## Files to Create/Modify

- `src/app/lectures/[slug]/page.tsx` — New dynamic route

## Checklist

### page.tsx creation
- [ ] Export `const dynamic = "force-dynamic"` for server-side rendering
- [ ] Define default async function `LectureSlugPage` with `params: { slug: string }`
- [ ] `await params` to get the slug (Next.js 16 pattern)
- [ ] Call `scanLectureCollection()` to get all entries
- [ ] Find entry matching `slug` — if not found, call `notFound()` from `next/navigation`
- [ ] Call `readLectureEntry(entry)` to read the template source
- [ ] Call `validateTemplateSource(source)` to validate
- [ ] If invalid: render `<ValidationScreen>` with the lecture errors and append `<LectureNavigation>` after it, without introducing nested `<main>` elements
- [ ] If valid: render `<LecturePage>` and `<LectureNavigation>`
- [ ] Compute `previous` and `next` navigation targets from sorted collection entries
- [ ] Import all required modules: `scanLectureCollection`, `readLectureEntry` from collection, `validateTemplateSource`, `LecturePage`, `LectureNavigation`, `ValidationScreen`, `notFound`

### Navigation computation
- [ ] Find current entry index in sorted collection
- [ ] `previous` = entry at index - 1 (if exists), with `slug` and `title` from template metadata
- [ ] `next` = entry at index + 1 (if exists), with `slug` and `title` from template metadata
- [ ] Pass computed `previous` and `next` to `LectureNavigation`

### 404 handling
- [ ] Import `notFound` from `next/navigation`
- [ ] Call `notFound()` when slug doesn't match any collection entry

## Expected Behavior

- `/lectures/01-introduction` renders the first lecture with full layout
- `/lectures/nonexistent` returns 404
- Invalid lecture shows validation errors with next/prev navigation
- "Back to course" link present on all pages
- First lecture has no "Previous" link; last lecture has no "Next" link

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes

- Use `notFound()` from `next/navigation` for 404 (Next.js standard pattern)
- The route reads from the filesystem on every request (force-dynamic) — this is intentional for local-first workflow
- The `LectureNavigation` component is rendered outside `LecturePage` so it appears after the lecture content
- `ValidationScreen` already owns the outer `<main>` element, so keep the invalid branch free of nested `<main>` markup
