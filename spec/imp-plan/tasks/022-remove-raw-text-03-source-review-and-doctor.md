# Task 03: Report Human, Missing, and Placeholder Evidence in Review Diagnostics

## Objective

Make source-review worksheets and doctor reports expose the centralized raw-source states and role labels clearly, while keeping shared course evidence optional and primary source readiness strict.

## Dependencies

- Task 02: use the centralized classifier and status types.

## Exact Files to Modify

- `src/lib/lecture-template/sourceReview.ts`
- `src/lib/lecture-template/doctor.ts`
- `src/cli/commands/reviewSource.ts`
- `scripts/reviewSource.ts`

## Implementation Details

- In single mode, classify `content/raw-lecture.txt`; in collection mode, classify each `lectures/<slug>/raw-lecture.txt` as primary and `lectures/raw-course.txt` as shared.
- Always retain the shared evidence record when its expected path is missing or a placeholder, but add it to each lecture’s `additionalSources` only when its status is `present`.
- Keep worksheet creation nonfatal for missing or placeholder raw files. Update `collectMissingPrimarySourcePaths` or its replacement so both missing and primary placeholder states make source-fidelity readiness not ready; expose placeholder paths separately where output needs to distinguish them.
- Extend doctor’s raw-source report with placeholder state for primary and shared files. Primary missing/placeholder files must affect `readiness.sourceFidelityReview` and warnings; missing/placeholder shared evidence remains optional and must not block readiness by itself.
- Update Markdown and CLI/script summaries with stable role/provenance labels such as `Primary human source evidence`, `Optional shared human source evidence`, `Generated lecture template`, and `Scaffold placeholder; replace with human source`. Distinguish included/present, missing, and ignored placeholder evidence rather than calling every file “raw source.”
- Keep validation of lecture templates and course metadata separate from source-evidence readiness. Do not turn a missing/placeholder raw file into a schema validation failure.
- Keep the CLI command and repository script behavior equivalent, including zero exit status for a worksheet that was successfully written despite missing source evidence.

## Acceptance Criteria

- Worksheets preserve primary/shared roles and expected paths for all three statuses.
- A primary placeholder is reported as non-ready just like a missing primary file; shared missing/placeholder evidence is visibly optional and nonblocking.
- Rendered worksheet, doctor report, CLI output, and script output distinguish human evidence, generated artifacts, missing paths, and scaffold placeholders.
- Present shared evidence remains additional context; placeholder shared evidence never becomes worksheet evidence.

## Verification / Tests

```bash
npm test -- tests/lecture-template/source-review.test.ts tests/lecture-template/doctor.test.ts
npm run typecheck
```

Task 06 must add deterministic assertions for all status/role combinations and the CLI/script summaries.

## Cleanup Notes

- Do not modify raw files while generating a worksheet or doctor report.
- Preserve existing worksheet locations, timestamps, routes, validation fields, and JSON path/role names unless the additive `placeholder` status requires a type update.
