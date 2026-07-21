# Task: Add Assessment Metadata Contracts And Stable Activity Identity

## Goal

Add optional authored assessment metadata and normalized flashcard identity
without changing existing anchors, persisted answer keys, or direct component
fixtures.

## Dependencies

- None

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts`
- `src/lib/lecture-template/validateTemplate.ts`
- `src/lib/lecture-template/collection.ts`
- `src/lib/lecture-template/anchors.ts` only if a small helper is required; do
  not change existing section-anchor behavior.
- `tests/lecture-template/validateTemplate.test.ts`
- `tests/lecture-template/render-model.test.ts`
- `tests/lecture-template/anchors.test.ts` if the anchor helper changes.

## Checklist

- [ ] Add optional assessment metadata fields for `id` and
  `objective_refs`/normalized `objectiveRefs` to the five current activity
  interfaces without making existing programmatic fixtures invalid.
- [ ] Add optional normalized `anchor` support to `FlashcardComponent`.
- [ ] Add explicit normalized metadata types needed by the registry while
  preserving the existing `LectureComponent` union.
- [ ] Include `flashcard` in section-scoped assessment anchor generation.
- [ ] Validate optional `id` as a non-empty anchor-safe string and report
  author-locatable `INVALID_COMPONENT_FIELD` errors.
- [ ] Validate optional `objective_refs` as a non-empty list of non-empty
  strings.
- [ ] Detect duplicate explicit IDs within one lecture and report the later
  occurrence without treating generated-anchor duplicates as explicit-ID
  collisions.
- [ ] Add collection-level duplicate-ID diagnostics with the first declaration's
  path/line in the later error message or hint, and make `allPassed` false.
- [ ] Reject explicit-versus-derived registry ID collisions while keeping the
  generated fragment anchor unchanged.
- [ ] Normalize metadata into the render model and preserve authored order.
- [ ] Keep generated anchors unchanged when no explicit ID is present.
- [ ] Ensure explicit IDs never replace existing fragments or persistence keys;
  they identify registry records only.
- [ ] Generate a stable normalized flashcard anchor for validated templates.

## Expected Behavior

- Existing templates and direct component fixtures continue to typecheck.
- A template with `id: identify-boundary` exposes that ID in normalized
  assessment metadata while retaining its generated anchor.
- A template without metadata produces the same anchors and normalized output as
  before, except validated flashcards now receive an anchor.
- Duplicate IDs and malformed metadata fail with section/component/field context.
- Duplicate IDs across lectures identify both the later error location and the
  first declaration.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts tests/lecture-template/render-model.test.ts tests/lecture-template/anchors.test.ts
npm run typecheck
```

## Cleanup Notes

- Do not modify raw lecture source files.
- Do not change component rendering in this task.
