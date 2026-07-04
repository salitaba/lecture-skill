# Task: Scaffold Commands

## Goal

Add non-interactive local scaffold commands for creating a minimal collection or a new lecture in the active authoring workflow.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/scaffold.ts` - New scaffold helpers and authoring mode detection.
- `scripts/newCollection.ts` - CLI wrapper for collection scaffold.
- `scripts/newLecture.ts` - CLI wrapper for lecture scaffold.
- `package.json` - Add `new:collection` and `new:lecture`.
- `tests/lecture-template/scaffold.test.ts` - Add scaffold helper and script behavior tests.

## Checklist

- [x] Implement scaffold-specific authoring mode detection.
- [x] Treat `lectures/`, `lectures/course.yaml`, or numbered lecture folders as collection authoring mode.
- [x] Treat the repo as single-lecture mode only when no collection workspace exists.
- [x] Make `new:collection` refuse to overwrite existing `lectures/` content.
- [x] Make `new:collection` create `lectures/course.yaml`, `lectures/01-introduction/lecture.template.md`, and `lectures/01-introduction/raw-lecture.txt`.
- [x] Make collection-mode `new:lecture` choose the next numeric prefix and create template/raw files.
- [x] Make single-lecture `new:lecture` create `content/lecture.template.md` only when missing.
- [x] Never delete or overwrite existing source files.
- [x] Print created paths and next commands.
- [x] Keep commands non-interactive and deterministic.

## Expected Behavior

- Authors and agents can initialize a course or lecture without copying example folders.
- Generated templates are structurally valid placeholders.
- Existing user-authored content is never overwritten.

## Verification Commands

```bash
npm run test -- tests/lecture-template/scaffold.test.ts
npm run typecheck
```

## Cleanup Notes

- Scaffold tests must run in temp directories and remove created content after each test.
- Do not run scaffold commands against the real repo root except as a documented manual check in a copied workspace.
