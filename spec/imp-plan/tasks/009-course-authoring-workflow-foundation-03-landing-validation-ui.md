# Task: Collection Landing Metadata And Validation UI

## Goal

Render valid course metadata on the collection landing page and show actionable metadata validation errors without crashing or trusting invalid metadata values.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`

## Exact Files To Create Or Modify

- `src/app/page.tsx` - Route collection validation results to landing or validation display.
- `src/components/lecture-kit/CollectionLanding.tsx` - Render declared course metadata with fallback behavior.
- `src/components/lecture-kit/ValidationScreen.tsx` - Generalize labels/paths/source-area wording for course metadata.
- `tests/lecture-template/backward-compat.test.tsx` or a new focused landing test - Cover metadata rendering and validation display.

## Checklist

- [x] Render valid course `title` as the collection `<h1>`.
- [x] Render valid course `description` as the landing description.
- [x] Render optional `audience`, `level`, and `duration` when present.
- [x] Preserve `Lecture Collection` and inferred summary fallback when metadata is absent.
- [x] Show metadata errors when metadata is invalid.
- [x] Generalize `ValidationScreen` to accept a subject label and subject path.
- [x] Avoid hardcoded metadata errors being labeled as template frontmatter.
- [x] Keep lecture cards based on each lecture template's metadata.
- [x] Do not add new routes or change collection URL structure.

## Expected Behavior

- Collection mode uses `lectures/course.yaml` for course identity when valid.
- Missing metadata remains non-breaking.
- Malformed metadata produces an author-locatable validation screen or section.

## Verification Commands

```bash
npm run test -- tests/lecture-template/backward-compat.test.tsx
npm run test -- tests/lecture-template/collection.test.ts
npm run typecheck
```

## Cleanup Notes

- If a new rendering test file is added, keep fixtures in temp data or inline minimal objects.
- Do not modify CSS unless layout issues are introduced by the metadata block.
