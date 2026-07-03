# Task: Manifests And Reviewer Files

**Goal**: Generate self-describing package metadata and reviewer helper files from the same manifest model used by the CLI.

**Dependencies**: `004-static-review-package-05-package-assembly-rewrite.md`

## Files to Create/Modify

- `src/lib/lecture-template/reviewPackage.ts` — Add `manifest.json`, `MANIFEST.md`, package README, and review checklist helpers
- `scripts/packageReview.ts` — Ensure generated reviewer files are written during package assembly
- `docs/mvp-review-checklist.md` — Read as source material only; modify only if the plan requires updating the project checklist itself
- `tests/lecture-template/review-package.test.ts` — Add/update manifest and reviewer-file tests

## Checklist

- [x] Write `manifest.json` in the package root.
- [x] Include package creation timestamp, project name, package type, source mode, validation command, validation result, exported route count, lecture count, entry HTML path, and package contents summary.
- [x] Include per-lecture slug, title, description, audience, level, duration, source template path, rendered output path, and section count.
- [x] Include ignored inactive template paths when applicable.
- [x] Include git commit hash or `unavailable`.
- [x] Include dirty working tree status or `unavailable`.
- [x] Include Node.js version and npm version.
- [x] Keep manifest fields stable enough for tests without asserting exact timestamps.
- [x] Ensure `manifest.json` does not include raw lecture prose beyond metadata and file paths.
- [x] Generate `MANIFEST.md` from the same manifest model.
- [x] Add a short package-local `README.md` explaining:
  - open `index.html`
  - what the package contains
  - how to inspect source templates and manifests
  - no Node.js, npm install, local static server, or dev server is required
- [x] Copy or adapt `docs/mvp-review-checklist.md` to `REVIEW_CHECKLIST.md`.
- [x] If `docs/mvp-review-checklist.md` is too MVP-specific, create a concise checklist from spec 004 quality gates instead.
- [x] If a package index is added, name it `PACKAGE_INDEX.html` and link to it from README/manifest; do not replace root `index.html`.

## Expected Behavior

- The package is understandable without the repository.
- Reviewers can identify what was exported, when, from which source paths, and with what validation result.
- Machine-readable and human-readable manifests agree because they come from one model.
- Reviewer files do not expose inactive or raw lecture content beyond copied active source templates.

## Verification

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run typecheck
npm run package:review
```

## Cleanup Notes

- Tests that write package roots should use temporary directories and remove them in `afterEach`.
- Manual package directories can be removed after inspecting `manifest.json`, `MANIFEST.md`, `README.md`, and `REVIEW_CHECKLIST.md`.
