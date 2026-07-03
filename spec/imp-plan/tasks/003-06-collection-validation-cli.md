# Task: Collection Validation CLI

**Goal**: Extend the validation CLI to support collection mode with per-lecture status output.

**Dependencies**: Task 1 (collection scanning module)

## Files to Create/Modify

- `src/lib/lecture-template/validateCli.ts` — Add `validateCollectionCli()` function
- `scripts/validate.ts` — Auto-detect collection mode

## Checklist

### validateCli.ts additions
- [ ] Import `validateCollection` from `./collection`
- [ ] Add `validateCollectionCli(): Promise<CliValidationOutput>` function
- [ ] Call `validateCollection()` to get results
- [ ] Format output exactly as spec:
  ```
  Collection validation: N lectures found

    [PASS] <slug>/lecture.template.md
    [FAIL] <slug>/lecture.template.md
      - <error code>: <error message>

  X of Y lectures passed validation.
  ```
- [ ] Each error line prefixed with `  - ` and indented under the FAIL line
- [ ] Exit status: 0 if `allPassed`, 1 if any failed
- [ ] Handle edge case: 0 lectures found → output "0 lectures found" and exit 0

### scripts/validate.ts updates
- [ ] Import `isCollectionMode` from collection module
- [ ] At startup: check `await isCollectionMode()`
- [ ] If collection mode: call `validateCollectionCli()`
- [ ] If single-lecture mode: call `validateTemplateFile()` as before (with optional path argument)
- [ ] Preserve existing exit behavior

## Expected Behavior

```bash
# Single-lecture mode (no lectures/ directory)
npm run validate
# → "Valid lecture template: content/lecture.template.md"

# Collection mode (lectures/ exists with 3 lectures, 1 invalid)
npm run validate
# → Collection validation output with per-lecture status
# → Exit 1 because at least one lecture failed
```

## Verification

```bash
npm run typecheck
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
```

## Notes

- `scripts/validate.ts` owns collection detection; `validateCli.ts` should only format collection validation results
- The collection error lines should match the spec format exactly, even if `formatError()` is still used for the single-template CLI path
- The CLI output format must match the spec exactly, including the blank lines, indentation, and per-error bullet shape shown in the plan
