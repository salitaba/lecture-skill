# Task 06: Add Deterministic Regression Coverage for Behavior and Guidance

## Objective

Lock the no-mutation, opt-in-context, three-state evidence, packaging, diagnostic, and placeholder-preservation contracts in deterministic tests without attempting to infer whether user text was written by an AI.

## Dependencies

- Tasks 01–05: test the completed guidance, classifier, diagnostics, package, and scaffold behavior.

## Exact Files to Create or Modify

- **Create**: `tests/lecture-template/agent-guidance.test.ts`
- **Modify**: `tests/lecture-template/init.test.ts`
- **Modify**: `tests/lecture-template/scaffold.test.ts`
- **Modify**: `tests/lecture-template/source-review.test.ts`
- **Modify**: `tests/lecture-template/doctor.test.ts`
- **Modify**: `tests/lecture-template/review-package.test.ts`

## Implementation Details

- Extend init/scaffold tests to assert the marked placeholder content, `placeholder` classification, no automatic `lectures/raw-course.txt`, non-overwrite behavior for existing per-lecture and shared sources, and single-mode template-only behavior.
- Add source-review tests for present/missing/placeholder primary evidence; present/missing/placeholder shared evidence; per-lecture primary versus shared additional role; placeholder exclusion from `additionalSources`; nonfatal worksheet generation; and stable human/placeholder labels.
- Add doctor tests that assert primary missing/placeholder states make source-fidelity readiness not ready and emit the intended warnings, while shared missing/placeholder states remain optional and nonblocking.
- Extend review-package tests to assert canonical-path-only discovery, shared evidence packaging, manifest records for missing/placeholder paths, no copied placeholder, no copied unrelated raw-like file, present-source snapshot verification, and role/status/label output.
- Create `agent-guidance.test.ts` that reads the canonical Claude skill, root `SKILL.md`, Codex entry point, `AGENTS.md`, and `CLAUDE.md` and asserts the no-create/no-edit/no-overwrite raw-source rule, explicit opt-in shared-context rule, placeholder/non-evidence language, and provenance limitation. Use stable phrases or focused regular expressions rather than brittle full-file snapshots.
- In the guidance test, run `runInit` in a temporary consumer workspace with the repository as `packageRoot`; assert the updated three distributed skill files are copied and that repository-only `AGENTS.md`/`CLAUDE.md` are not installed by init.
- Keep all tests deterministic and filesystem-isolated. Do not test AI authorship; test only observable preservation, classification, output, and documentation contracts.

## Acceptance Criteria

- The focused test suite covers every acceptance behavior in Tasks 01–05 and distinguishes all three statuses.
- Tests prove shared course source is available to repository evidence workflows but is not automatically treated as agent context by guidance.
- Tests prove placeholders are never copied into review packages and never count as primary source-fidelity readiness.
- Tests do not mutate repository content and clean up all temporary files and changed working directories.

## Verification / Tests

```bash
npm test -- tests/lecture-template/init.test.ts tests/lecture-template/scaffold.test.ts
npm test -- tests/lecture-template/source-review.test.ts tests/lecture-template/doctor.test.ts tests/lecture-template/review-package.test.ts
npm test -- tests/lecture-template/agent-guidance.test.ts
npm run typecheck
```

## Cleanup Notes

- Use temporary directories for all CLI and filesystem tests; restore `process.cwd()` in `afterEach` and remove temp roots recursively.
- Do not add AI-generated fixture content or modify raw-source fixtures in `examples/`.
