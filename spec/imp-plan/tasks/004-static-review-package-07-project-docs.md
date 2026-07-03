# Task: Project Documentation And Agent Workflow

**Goal**: Document the review-package workflow for human authors and AI agents without changing normal authoring expectations.

**Dependencies**: `004-static-review-package-04-cli-build-staging.md`, `004-static-review-package-06-manifests-reviewer-files.md`

## Files to Create/Modify

- `README.md` — Add author-facing `npm run package:review` documentation
- `SKILL.md` — Add AI-agent handoff workflow

## Checklist

- [x] Update `README.md` with `npm run package:review`.
- [x] Document output path format under `review-packages/<timestamp>-lecture-site/`.
- [x] Explain that packaging validates first and blocks invalid single lectures or invalid collections.
- [x] Document single-lecture source selection: `content/lecture.template.md`.
- [x] Document collection source selection: active `lectures/<slug>/lecture.template.md` files only.
- [x] Document `out/` conflict behavior when a pre-existing export directory is present.
- [x] Explain what to send to reviewers: the generated package folder, or zip if optional zip support is implemented later.
- [x] Keep normal authoring instructions centered on `npm run validate` and `npm run dev`; do not imply export is required for every edit.
- [x] Update `SKILL.md` with the AI-agent workflow:
  - create or update lecture templates
  - run `npm run validate`
  - revise until validation passes
  - run `npm run package:review` only when a handoff artifact is requested
  - report the generated package path
- [x] Do not add hosted publishing, CMS, upload, analytics, or comment-workflow language.

## Expected Behavior

- Authors know when to use the package command and where the artifact appears.
- AI agents do not export automatically during every lecture generation.
- Documentation matches the implemented validation and source-selection behavior.

## Verification

```bash
npm run validate
npm run typecheck
```

## Cleanup Notes

- Documentation changes create no test data.
- If documentation examples mention generated packages, use generic paths rather than committing generated package contents.
