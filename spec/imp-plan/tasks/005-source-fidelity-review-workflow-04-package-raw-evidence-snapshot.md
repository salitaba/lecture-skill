# Task: Package Raw Evidence Snapshot

**Goal**: Extend review-package preflight to snapshot expected raw source evidence separately from generated template sources and expose present/missing evidence consistently for packaging.

**Dependencies**: `005-source-fidelity-review-workflow-02-source-review-model.md`

## Files to Create/Modify

- `src/lib/lecture-template/reviewPackage.ts` — Extend preflight, evidence verification, manifest model inputs, and package-copy data
- `tests/lecture-template/review-package.test.ts` — Extend deterministic package tests for raw evidence snapshot behavior

## Checklist

- [x] Extend `ReviewPackagePreflight` with raw evidence records separate from generated template `sources`.
- [x] Include raw evidence fields for repository source path, package path, status, role, optional lecture slug, and captured contents when present.
- [x] Capture `content/raw-lecture.txt` for single-lecture mode when present.
- [x] Capture each `lectures/<slug>/raw-lecture.txt` for collection mode when present.
- [x] Capture `lectures/raw-course.txt` for collection mode when present.
- [x] Mark expected missing raw source evidence as `missing` without failing preflight or package assembly.
- [x] Verify present raw evidence before static build or assembly; fail packaging with an actionable rerun message if a present raw source changes or disappears after preflight.
- [x] Write copied raw evidence from captured preflight contents, not from later live file reads.
- [x] Preserve existing generated template source copying unchanged.
- [x] Do not scan arbitrary raw files, inactive content, or unrelated files under `lectures/`.
- [x] Add tests that present raw sources are copied to `source/content/raw-lecture.txt`, `source/lectures/<slug>/raw-lecture.txt`, and `source/lectures/raw-course.txt` as applicable.
- [x] Add tests that missing raw sources do not fail package assembly.
- [x] Add tests that changed or removed present raw evidence after preflight fails verification before build/assembly.

## Expected Behavior

- Package preflight captures one consistent source-evidence snapshot for validation, warnings, manifests, worksheet generation, and package copying.
- Missing raw source evidence is visible but nonfatal.
- Present raw source evidence cannot silently change between preflight and package assembly.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
```

## Cleanup Notes

- Review-package tests must write only inside temp repositories.
- Remove temp package directories, staging directories, `out/`, and `.next-review/` created by tests.
