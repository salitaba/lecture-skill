# Task: Document The Unified Activity Contract

## Goal

Document the unified assessment model and add focused fixtures for metadata
validation without modifying raw-source evidence.

## Dependencies

- `024-unified-interaction-assessment-engine-01-contracts-metadata.md`
- `024-unified-interaction-assessment-engine-02-registry-capabilities.md`
- `024-unified-interaction-assessment-engine-04-review-index-surfaces.md`

## Exact Files To Create Or Modify

- `examples/component-demo.template.md`
- `examples/invalid/assessment-metadata-errors.template.md` (new)
- `README.md`
- `SKILL.md`
- `tests/lecture-template/validate-cli.test.ts`
- `tests/lecture-template/validate-collection-cli.test.ts`
- `tests/lecture-template/review-package.test.ts` if additive metadata is
  included in the package manifest.
- `src/lib/lecture-template/validateCli.ts` if JSON assessment summaries are
  added.
- `src/lib/lecture-template/reviewPackage.ts` if per-lecture assessment
  summaries are added to the manifest.

## Checklist

- [ ] Add optional `id` and `objective_refs` examples to the component demo.
- [ ] Add invalid metadata fixtures for malformed IDs, duplicate IDs, empty
  objective references, and malformed flashcard metadata.
- [ ] Document evaluation modes and when to use quiz, question set,
  free-response, practice task, and flashcard.
- [ ] Document that IDs identify registry records but do not replace existing
  anchors unless a future migration explicitly changes that contract.
- [ ] Document that answer review is local practice feedback, not grading.
- [ ] Document that hidden answers are pacing aids, not secure content.
- [ ] Document that free-response and practice drafts are not persisted.
- [ ] Document flashcards as indexable reveal activities rather than graded
  assessments.
- [ ] Add human and JSON diagnostic assertions for metadata field paths.
- [ ] Add deterministic JSON/review-package assertions for per-lecture
  assessment counts and evaluation modes, excluding answers and learner state.
- [ ] Assert explicit `learnerStateIncluded: false` in review-package metadata.
- [ ] Keep the agent guidance source-grounded and within supported schema.

## Expected Behavior

- A new author can understand the unified activity contract from README/SKILL.
- Invalid metadata produces actionable CLI diagnostics.
- Raw lecture files remain untouched.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validate-cli.test.ts tests/lecture-template/validate-collection-cli.test.ts tests/lecture-template/review-package.test.ts
npm run validate
```

## Cleanup Notes

- Do not edit `content/raw-lecture.txt`, `lectures/raw-course.txt`, or any raw
  lecture fixture.
- Do not read or copy `examples/golden.template.md` during fixture authoring.
