# Task: Validation CLI JSON Output

## Goal

Add stable machine-readable validation output behind `npm run validate -- --json` while preserving the existing human-readable default behavior.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`

## Exact Files To Create Or Modify

- `scripts/validate.ts` - Parse `--json`, optional single-template path, and unknown flags.
- `src/lib/lecture-template/validateCli.ts` - Add JSON output builders and metadata-aware human collection output.
- `src/lib/lecture-template/collection.ts` - Add a quiet collection validation path or warnings payload if needed.
- `tests/lecture-template/validate-cli.test.ts` - Add single-lecture JSON/argument tests.
- `tests/lecture-template/validate-collection-cli.test.ts` - Add collection metadata and JSON tests.

## Checklist

- [x] Keep `npm run validate` human output as the default.
- [x] Ensure `--json` is never interpreted as a template path.
- [x] Preserve optional template path behavior in single-lecture mode.
- [x] Reject unknown flags with nonzero status and clear stderr.
- [x] Emit parseable JSON only on stdout in JSON mode.
- [x] Prevent skipped-directory warnings from polluting JSON stdout.
- [x] Include `ok`, `mode`, validation status, errors, and relevant paths in JSON.
- [x] Include `courseMetadata` status/path/metadata/errors in collection JSON.
- [x] Return exit status `0` only when validation passes.
- [x] Add spawned script coverage for the real npm-style `--json` argument path.

## Expected Behavior

- Humans can keep using `npm run validate` unchanged.
- Scripts and AI agents can parse `npm run validate -- --json` without scraping prose.
- Invalid lecture templates or invalid course metadata produce JSON plus nonzero exit status.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validate-cli.test.ts tests/lecture-template/validate-collection-cli.test.ts
npm run validate
npm run validate -- --json
npm run typecheck
```

## Cleanup Notes

- Spawned CLI tests should write stdout/stderr logs under their temp directory and remove that directory in cleanup.
- Do not change template validation schema or component validation behavior.
