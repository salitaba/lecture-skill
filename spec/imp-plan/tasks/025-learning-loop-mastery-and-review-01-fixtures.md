# Task: Add Learning Loop Fixtures And Contract Test Data

## Goal

Add non-raw fixtures that lock the objective-ID, objective-reference,
collection, and review-state cases required by the finalized plan.

## Dependencies

- None.

## Exact Files To Create Or Modify

- `tests/fixtures/learning-loop/objectives-explicit.template.md` — create.
- `tests/fixtures/learning-loop/objectives-legacy.template.md` — create.
- `tests/fixtures/learning-loop/objectives-invalid-markers.template.md` — create.
- `tests/fixtures/learning-loop/objectives-duplicate-ids.template.md` — create.
- `tests/fixtures/learning-loop/assessment-coverage.template.md` — create.
- `tests/fixtures/learning-loop/collection/01-first/lecture.template.md` — create.
- `tests/fixtures/learning-loop/collection/02-second/lecture.template.md` — create.
- `tests/fixtures/learning-loop/collection/03-invalid/lecture.template.md` — create.
- `tests/fixtures/learning-loop/review-state.json` — create.
- `tests/lecture-template/fixtures.test.ts` — modify to register the new
  non-raw fixtures.

## Checklist

- [x] Use explicit markers such as `[build-timeline]` in the valid fixture and
  verify that the visible objective text remains source-grounded.
- [x] Include a legacy unmarked objective fixture with repeated and reordered
  text cases available for deterministic-ID tests.
- [x] Cover empty IDs, invalid IDs, malformed bracket prefixes, and a marker
  with no objective text in the invalid fixture.
- [x] Include linked assessments, an unlinked objective, an unresolved
  `objective_refs` value, and a legacy objective in the coverage fixture.
- [x] Give the two valid collection fixtures the same objective ID with
  lecture-specific content so later tests can prove lecture-local namespacing.
- [x] Make the invalid collection fixture fail validation without changing any
  existing project lecture.
- [x] Include scheduler records for every rating, stale assessment IDs,
  malformed dates, and otherwise valid state in `review-state.json`; keep
  corrupted JSON cases as test input rather than pretending corrupted JSON is
  a valid fixture file.
- [x] Extend fixture assertions only; do not add production behavior here.

## Expected Behavior

- Fixtures are sufficient to exercise valid explicit IDs, legacy objectives,
  blocking reference errors, advisory coverage gaps, duplicate IDs, collection
  ordering, stale state, and malformed state.
- Existing fixture coverage continues to pass unchanged.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts tests/lecture-template/parseTemplate.test.ts tests/lecture-template/validateTemplate.test.ts
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never create, edit, summarize, replace, or
  delete those files.
- Do not modify existing authored lecture templates; all new fixture content
  belongs under `tests/fixtures/learning-loop/`.
