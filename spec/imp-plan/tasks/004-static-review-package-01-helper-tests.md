# Task: Review Package Helper Tests

**Goal**: Add focused tests that lock down the review-package contract before implementation: preflight source selection, manifest shape, source snapshot behavior, and local-file HTML rewriting.

**Dependencies**: None

## Files to Create/Modify

- `tests/lecture-template/review-package.test.ts` — New test file for deterministic review-package helpers
- `tests/lecture-template/testUtils.ts` — Modify only if an existing fixture helper can be reused cleanly

## Checklist

- [x] Create `tests/lecture-template/review-package.test.ts`.
- [x] Follow the temp-directory and `process.chdir()` cleanup pattern used by `tests/lecture-template/collection.test.ts`.
- [x] Add single-lecture preflight tests using `content/lecture.template.md`.
- [x] Add collection preflight tests using valid `lectures/<slug>/lecture.template.md` fixtures in sorted order.
- [x] Assert collection mode excludes inactive `content/lecture.template.md` from active copied sources.
- [x] Assert preflight captures exact source contents and exposes paths needed for copying under `source/`.
- [x] Add a test for the source-content comparison that fails if a template changes after preflight and before build.
- [x] Add invalid single-lecture and invalid collection preflight tests that assert no completed package directory is created.
- [x] Add manifest model tests for stable fields: mode, lecture count, exported route count, entry HTML path, source paths, rendered output paths, section count, and unavailable git/npm fallbacks.
- [x] Add `MANIFEST.md` rendering tests for mode, lecture count, entry file, source paths, and package path hints.
- [x] Add `rewriteExportedHtmlForFileProtocol()` tests for root `index.html` and nested `lectures/<slug>/index.html`.
- [x] Cover `href`, `src`, `srcset`, stylesheet/preload/modulepreload links, script tags, and `_next` assets.
- [x] Assert external URLs, protocol URLs, hashes, `mailto:`, `tel:`, data URLs, and unrelated manifest/source links are not rewritten.

## Expected Behavior

- Tests describe the package behavior without requiring `next build`.
- Helper coverage stays deterministic and fast under Vitest.
- Invalid content cannot appear to create a completed package in helper-level tests.
- File-protocol link rewriting is specified before package assembly depends on it.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
```

## Cleanup Notes

- Any test-created repository state must live under `mkdtempSync(os.tmpdir())`.
- Restore `process.cwd()` in `afterEach`.
- Remove temporary directories with `rmSync(tempRoot, { recursive: true, force: true })`.
- Do not write to real `content/`, `lectures/`, `out/`, or `review-packages/` in the repository root from these tests.
