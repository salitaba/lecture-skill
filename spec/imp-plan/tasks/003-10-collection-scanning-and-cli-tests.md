# Task: Collection Scanning And CLI Tests

**Goal**: Add focused tests for collection discovery, sorting, skipping invalid folders, and collection validation CLI output.

**Dependencies**: Tasks 1, 6, and 9

## Files to Create/Modify

- `tests/lecture-template/collection.test.ts`
- `tests/lecture-template/validate-collection-cli.test.ts`

## Checklist

### collection.test.ts
- [ ] Test `isCollectionMode()` returns false when `lectures/` is missing
- [ ] Test `isCollectionMode()` returns false when `lectures/` exists but has no valid lecture directories
- [ ] Test `scanLectureCollection()` includes only directories matching `^\d{2}-.+$`
- [ ] Test entries are sorted by numeric prefix, not lexicographic name order
- [ ] Test subdirectories without `lecture.template.md` are skipped
- [ ] Test `validateCollection()` returns `lectureCount`, per-lecture `results`, and `allPassed`
- [ ] Keep filesystem setup isolated with temp directories and cleanup after each test

### validate-collection-cli.test.ts
- [ ] Test the all-valid case prints the collection header, PASS lines, and success count
- [ ] Test a mixed valid/invalid collection prints PASS and FAIL lines in authored order
- [ ] Test FAIL output includes indented per-error lines under the lecture entry
- [ ] Test the 0-lecture case prints `0 lectures found` and exits 0
- [ ] Test the exit code is 1 when any lecture fails validation
- [ ] Compare the full output string, including blank lines and indentation, against the spec format

## Expected Behavior

- Collection scanning and CLI formatting remain deterministic
- A single failing lecture does not stop the CLI from reporting the rest of the collection
- Empty or missing collections do not crash the CLI

## Verification

```bash
npm run test -- tests/lecture-template/collection.test.ts tests/lecture-template/validate-collection-cli.test.ts
npm run typecheck
```

## Notes

- Use the example collection fixture files where they make the tests simpler, but do not require the real repository tree to be mutated during the test run
- Restore any temporary working directory state in `afterEach`
