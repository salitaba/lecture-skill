# Task: Add Objective Diagnostics And Reviewer Protections

## Goal

Expose objective coverage and evaluation-mode diagnostics in validation and
review-package outputs while proving that learner review state and answer text
remain excluded.

## Dependencies

- `025-learning-loop-mastery-and-review-02-objectives.md`
- `025-learning-loop-mastery-and-review-08-collection-ux.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/assessments.ts`
- `src/lib/lecture-template/validateCli.ts`
- `src/lib/lecture-template/reviewPackage.ts`
- `src/lib/lecture-template/doctor.ts`
- `tests/lecture-template/validate-cli.test.ts`
- `tests/lecture-template/validate-collection-cli.test.ts`
- `tests/lecture-template/review-package.test.ts`
- `tests/lecture-template/doctor.test.ts`
- `tests/lecture-template/lecture-components.test.tsx`

## Checklist

- [x] Define a serializable `ObjectiveDiagnostics` contract containing total
  objectives, explicit-ID count, unresolved references, objectives without
  linked assessments, assessment counts by evaluation mode, and
  `learnerStateIncluded: false`.
- [x] Extend assessment summaries and collection helpers with lecture slug,
  section anchor, objective references, stable assessment IDs, and coverage
  data without copying answer text into learner-facing records.
- [x] Propagate diagnostics through single-lecture and collection validation
  JSON, review-package lecture records, `manifest.json`, `MANIFEST.md`, and
  reviewer disclosures.
- [x] Keep unresolved explicit references blocking, no-assessment objectives
  advisory, and existing answer-key behavior unchanged.
- [x] Update doctor/readiness wording only to describe local review support;
  state clearly that the CLI cannot inspect browser learner state.
- [x] Add executable assertions that authored objectives render before
  hydration, dashboard counts are neutral before local state loads, review
  packages contain no learner review records/due dates, and review controls do
  not introduce unexplained print regions.

## Expected Behavior

- Author and reviewer outputs show objective coverage quality signals without
  grading learners or leaking answers.
- Validation JSON and package manifests explicitly disclose that learner state
  is excluded.
- Static/export/print behavior and existing reviewer package records remain
  deterministic apart from the planned diagnostics fields.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validate-cli.test.ts tests/lecture-template/validate-collection-cli.test.ts tests/lecture-template/review-package.test.ts tests/lecture-template/doctor.test.ts tests/lecture-template/lecture-components.test.tsx
npm run typecheck
npm run validate -- --json
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never edit them.
- Do not add localStorage reads, due dates, attempts, drafts, or answer text to
  CLI output, review packages, manifests, snapshots, or logs.
