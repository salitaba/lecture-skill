# Task: Update Examples, README, And Agent Guidance

## Goal

Document the stronger assessment authoring contract for educators and agents, and add valid and invalid examples that exercise the new components.

## Dependencies

- `011-stronger-assessments-02-validation-normalization.md`
- `011-stronger-assessments-05-question-set-component.md`
- `011-stronger-assessments-06-free-response-component.md`
- `011-stronger-assessments-07-practice-task-component.md`

## Exact Files To Create Or Modify

- `examples/component-demo.template.md` - Add valid demos for `question_set`, `free_response`, and `practice_task`.
- `examples/multi-lecture/lectures/01-introduction/lecture.template.md` or `examples/multi-lecture/lectures/02-core-concepts/lecture.template.md` - Add at least one valid new assessment component if collection tests use fixture content.
- `README.md` - Document schemas, usage guidance, reveal/print/review-package behavior, local-only input, shuffle limits, and non-goals.
- `SKILL.md` - Update agent authoring guidance for choosing assessment types.
- `examples/invalid/question-set-field-errors.template.md` - Already created in task 03; update only if documentation examples uncover missing invalid cases.
- `examples/invalid/free-response-field-errors.template.md` - Already created in task 03; update only if needed.
- `examples/invalid/practice-task-field-errors.template.md` - Already created in task 03; update only if needed.
- `tests/lecture-template/fixtures.test.ts` - Update expectations for valid demos if needed.

## Checklist

- [x] Add realistic `question_set`, `free_response`, and `practice_task` blocks to the component demo gallery.
- [x] Keep `examples/component-demo.template.md` valid as the all-components gallery.
- [x] Ensure valid examples demonstrate recall, written reasoning, and applied practice use cases.
- [x] Add at least one new assessment component to a multi-lecture valid fixture if collection/index tests rely on fixture data.
- [x] Document when to use `quiz`, `question_set`, `free_response`, and `practice_task`.
- [x] Document that hidden answers/guidance are pacing aids, not security.
- [x] Document that learner input is local-only and not saved.
- [x] Document that `question_set.shuffle_options` is preview-only and authored order is preserved for print/review/static output.
- [x] Document that `question_set` is single-answer in P0 and multiple-answer support is deferred.
- [x] Warn agents not to invent unsupported assessment component types or runtime grading.

## Expected Behavior

- Educators and agents can author stronger assessments from the README and `SKILL.md` without guessing schema shapes.
- Demo and multi-lecture fixtures validate after the new schema is implemented.
- Documentation aligns with the finalized plan and does not introduce P1 fields or unsupported grading behavior.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/collection.test.ts
```

## Cleanup Notes

- Do not add generated package output or screenshots.
- If `content/lecture.template.md` is changed for manual demo validation, restore it before finishing.
