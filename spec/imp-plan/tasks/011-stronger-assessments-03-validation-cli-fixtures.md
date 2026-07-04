# Task: Add Invalid Fixtures And CLI Nested Field Coverage

## Goal

Add invalid assessment fixtures and prove human and JSON validation output preserve actionable nested field paths for the new component types.

## Dependencies

- `011-stronger-assessments-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `examples/invalid/question-set-field-errors.template.md` - Invalid `question_set` examples.
- `examples/invalid/free-response-field-errors.template.md` - Invalid `free_response` examples.
- `examples/invalid/practice-task-field-errors.template.md` - Invalid `practice_task` examples.
- `tests/lecture-template/fixtures.test.ts` - Include the new invalid fixtures in fixture validation expectations if needed.
- `tests/lecture-template/validate-cli.test.ts` - Add human and JSON output assertions for nested field paths.
- `tests/lecture-template/validate-collection-cli.test.ts` - Add collection-mode assertions if nested assessment errors are exercised in collection validation.
- `src/lib/lecture-template/validateCli.ts` - Modify only if tests show nested `field`, `sectionTitle`, `componentType`, or locator data is lost.

## Checklist

- [x] Add an invalid `question_set` fixture covering an empty title, fewer than two questions, non-mapping question entries, empty question text, empty option text, answer mismatch, non-boolean `shuffle_options`, and empty feedback.
- [x] Add an invalid `free_response` fixture covering empty or missing `title`, empty or missing `prompt`, empty `guidance`, and empty `placeholder`.
- [x] Add an invalid `practice_task` fixture covering empty `title`, empty `task`, empty `steps`/`hints`, invalid `starter_code`, empty `solution`, invalid rubric entry shape, and missing rubric `expected`.
- [x] Assert human CLI output includes field paths such as `questions[0].options[1]`, `starter_code.language`, and `rubric[0].expected`.
- [x] Assert JSON CLI output includes the same field paths plus `componentType`, `sectionTitle`, and locator metadata.
- [x] Keep existing invalid fixtures and CLI output behavior unchanged.

## Expected Behavior

- Authors get specific nested validation errors for malformed stronger assessment blocks.
- `npm run validate` human output and JSON output expose the same stable fields implementers and agents need to fix templates.
- Collection validation does not collapse nested assessment errors into generic component failures.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validate-cli.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
```

## Cleanup Notes

- CLI tests may create temporary fixture directories through test utilities; keep cleanup inside the tests using existing patterns.
- Do not leave generated validation output files in the repository.
