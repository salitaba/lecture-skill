# Task: Review Package And Manual UX Verification

## Goal

Verify the quiz reveal behavior in local preview, print output, and generated static review packages without overstating what existing review-package unit tests prove.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md`
- `008-improve-quiz-reveal-ux-02-styles-print.md`
- `008-improve-quiz-reveal-ux-05-docs-examples.md`
- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`

## Exact Files To Create Or Modify

- No production code files are required for this task.
- `tests/lecture-template/review-package.test.ts` - Read only unless the implementer intentionally adds a slow rendered-package integration test.
- `scripts/packageReview.ts` - Read only unless package generation fails because of the quiz reveal change.
- `src/lib/lecture-template/reviewPackage.ts` - Read only unless package generation fails because of the quiz reveal change.
- Optional new test file only if automated package coverage is intentionally added: `tests/lecture-template/review-package-rendered-output.test.ts` or another clearly named slow integration test.

## Checklist

- [x] Run the normal review package flow with `npm run package:review`.
- [x] Do not add a small assertion to `tests/lecture-template/review-package.test.ts` and claim it proves interactivity; that file tests helper models and URL rewriting, not rendered Next behavior.
- [ ] If automated package coverage is added, make it a slow rendered-package integration test that copies `examples/component-demo.template.md` to `content/lecture.template.md`, runs the package flow, and inspects generated `index.html` for reveal-control markup plus rewritten JS/CSS references.
- [ ] Prefer manual package verification unless the team accepts the runtime cost of a slow integration test.
- [ ] Save the current `content/lecture.template.md` before manual demo-package work.
- [ ] Copy `examples/component-demo.template.md` to `content/lecture.template.md`.
- [x] Run `npm run validate`.
- [ ] Run `npm run dev` and open the local preview.
- [ ] Check quiz layout at approximately 390px, 768px, and 1280px widths.
- [ ] Confirm no body-level horizontal overflow in the browser console with `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [ ] Click each quiz reveal control and confirm long content wraps without overlap.
- [ ] Confirm keyboard activation works with the native button.
- [ ] Check print preview and confirm answer/explanation are printed without depending on reveal state.
- [ ] Run `npm run package:review`, open the generated package entry file, and confirm `Show answer` works when JavaScript is available.
- [ ] Restore `content/lecture.template.md`.

## Expected Behavior

- Local preview and static review package both preserve the client-side quiz reveal interaction when JavaScript is available.
- Print output always includes answer and explanation with clear labels.
- The no-JavaScript behavior matches the documented fallback.
- Manual review notes distinguish rendered-package behavior from helper-level review-package unit tests.

## Verification Commands

```bash
npm run validate
npm run dev
npm run package:review
```

Optional package-related test command if a slow integration test is added:

```bash
npm run test -- tests/lecture-template/review-package-rendered-output.test.ts
```

## Cleanup Notes

- Restore `content/lecture.template.md` after using the component demo for manual review.
- Stop any development server started for this task.
- Remove generated review-package output only if it is not expected to be committed and is not ignored by the repository.
- Do not revert unrelated edits in package scripts or review-package tests.
