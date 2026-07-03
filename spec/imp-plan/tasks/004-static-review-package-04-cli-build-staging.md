# Task: Package CLI And Build Staging

**Goal**: Add the `npm run package:review` command and implement controlled validation, source drift checking, static build execution, and staging/output ownership.

**Dependencies**: `004-static-review-package-02-preflight-model.md`, `004-static-review-package-03-static-export-routes.md`

## Files to Create/Modify

- `scripts/packageReview.ts` — New CLI entrypoint
- `package.json` — Add `package:review`
- `src/lib/lecture-template/reviewPackage.ts` — Add build/staging orchestration helpers if they belong outside the CLI

## Checklist

- [x] Create `scripts/packageReview.ts` using `node --import ./scripts/register-ts-loader.mjs`.
- [x] Add `package:review` to `package.json`:
  - `node --import ./scripts/register-ts-loader.mjs scripts/packageReview.ts`
- [x] Run `runReviewPackagePreflight()` before creating package output.
- [x] On invalid preflight, print validation output, exit nonzero, and create no completed package directory.
- [x] Immediately before build, compare current source file contents against the preflight snapshot.
- [x] Spawn `next build` with `LECTURE_REVIEW_EXPORT=1`.
- [x] Treat Next `out/` as owned by this command only when the command established ownership for the current run.
- [x] If `out/` exists before the command owns it, fail with an actionable message asking the user to move or remove it.
- [x] Use `.next-review` as the static-export build directory if configured in task 03.
- [x] Avoid creating the final timestamped package directory until validation, source comparison, static build, HTML rewrite planning, manifest generation, and source-copy planning have succeeded.
- [x] Use a staging directory under `/tmp` or `review-packages/.tmp-*` if package assembly needs staging.
- [x] Remove command-created staging/build directories on failure.
- [x] Never delete pre-existing user-owned `out/`.
- [x] Print a concise success summary with final package directory and entry HTML path.

## Expected Behavior

- `npm run package:review` is the single documented author command.
- Invalid templates block packaging and return a nonzero exit code.
- Source drift after validation blocks packaging before build.
- A pre-existing user-owned `out/` directory is not overwritten or deleted.
- Partial package output is not left behind as a completed package.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
npm run package:review
```

## Cleanup Notes

- Remove only staging directories created by the command.
- If `npm run package:review` creates a real `review-packages/<timestamp>-lecture-site/` during manual verification, leave it for inspection during final smoke tests or remove it only after recording the result.
