# Task: Doctor Readiness Command

## Goal

Add `npm run doctor` to report local project readiness for preview, source-fidelity review, and static package creation.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`
- `009-course-authoring-workflow-foundation-02-validation-json-cli.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/doctor.ts` - New diagnostic model and readiness checks.
- `scripts/doctor.ts` - CLI wrapper.
- `package.json` - Add `doctor`.
- `tests/lecture-template/doctor.test.ts` - Add doctor model and script tests.

## Checklist

- [x] Report Node.js version and npm version.
- [x] Read `package.json` `engines.node` and report whether the current Node.js version satisfies it.
- [x] Report active mode: `single-lecture` or `collection`.
- [x] Report active template paths.
- [x] Report course metadata path/status in collection mode.
- [x] Report lecture count.
- [x] Report schema validation result.
- [x] Report raw source evidence status.
- [x] Report latest source-fidelity worksheet path if available.
- [x] Report latest static review package path if available.
- [x] Report readiness for preview, source-fidelity review, and static package creation.
- [x] Exit `0` when diagnostics run successfully, even with readiness warnings.
- [x] Exit nonzero only when the doctor command cannot inspect the project.
- [x] Reuse validation helpers instead of spawning `npm run validate`.

## Expected Behavior

- Authors and agents get one deterministic readiness report.
- Missing raw source, invalid templates, invalid metadata, missing worksheets/packages, and unsupported Node versions appear as warnings.
- Readiness warnings do not make the command fail.

## Verification Commands

```bash
npm run test -- tests/lecture-template/doctor.test.ts
npm run doctor
npm run typecheck
```

## Cleanup Notes

- Tests that create worksheet or package directories should use temp roots and clean them up.
- Keep doctor output human-readable; JSON doctor output is not part of P0 unless separately requested.
