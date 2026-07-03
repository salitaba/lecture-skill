# Task: Package Assembly And File-Protocol Rewrite

**Goal**: Assemble the final browser-openable review package and rewrite exported HTML so navigation and assets work when opened directly from the filesystem.

**Dependencies**: `004-static-review-package-04-cli-build-staging.md`

## Files to Create/Modify

- `src/lib/lecture-template/reviewPackage.ts` — Add package assembly, source copy, timestamp, and HTML rewrite helpers
- `scripts/packageReview.ts` — Wire assembly helpers into the CLI
- `tests/lecture-template/review-package.test.ts` — Extend or update helper tests as needed

## Checklist

- [x] Generate a sortable filesystem-safe local timestamp such as `YYYY-MM-DD-HHmm`.
- [x] Create final packages under `review-packages/<timestamp>-lecture-site/`.
- [x] Copy rendered static output from `out/` into the package root.
- [x] Keep root `index.html` as the rendered lecture or collection page.
- [x] Copy required Next static assets, including `_next/`, into the package root.
- [x] Copy source templates from captured preflight contents, not by re-reading active files:
  - single mode: `source/content/lecture.template.md`
  - collection mode: `source/lectures/<slug>/lecture.template.md`
- [x] Do not copy inactive `content/lecture.template.md` in collection mode.
- [x] Do not copy `node_modules`, `.next/cache`, unrelated repository files, raw lecture notes, inactive content, pre-existing build directories, or hidden tool state.
- [x] Implement `rewriteExportedHtmlForFileProtocol(html, htmlPath, packageRoot)`.
- [x] Run the rewrite on every exported `.html` file in the package.
- [x] Rewrite internal page links from absolute app paths to file-relative paths.
- [x] Rewrite `_next` asset references relative to the current HTML file.
- [x] Handle `href`, `src`, `srcset`, stylesheet links, preload/modulepreload links, and script tags.
- [x] Do not rewrite external URLs, protocol URLs, hashes, `mailto:`, `tel:`, data URLs, or unrelated source/manifest links.
- [x] Keep the rewrite deterministic and covered by task 01 tests.

## Expected Behavior

- A reviewer can open the printed `index.html` path directly in a browser without a dev server.
- Collection landing links, next/previous links, and back-to-course links work from `file://`.
- Static assets load from the copied package directory.
- Copied source templates match the validated snapshot.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
npm run package:review
```

## Cleanup Notes

- Test package assembly under temporary directories where possible.
- Manual package directories under `review-packages/` may be kept until final verification, then removed if they are only local test artifacts.
- Do not remove or overwrite package directories created by another user or a previous run unless implementation has positively identified them as current-run staging.
