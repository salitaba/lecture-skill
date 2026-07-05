# Task: Add Instructor Notes And Review Package Summaries

## Goal

Implement `instructor_note` rendering and extend static review package output with advanced-component summaries required by the finalized plan.

## Dependencies

- `013-advanced-ui-engine-components-01-types.md`
- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/InstructorNote.tsx` - Render instructor/reviewer guidance with explicit labels.
- `src/components/lecture-kit/SectionRenderer.tsx` - Dispatch `instructor_note`.
- `src/lib/lecture-template/reviewPackage.ts` - Extend preflight, manifest, lecture-record construction, manifest creation, and Markdown rendering for advanced component summaries.
- `scripts/packageReview.ts` - Update only if package command output or generated text needs an explicit wording change.
- `tests/lecture-template/review-package.test.ts` - Add focused coverage if this task implements tests alongside package changes.

## Checklist

- [x] Render `InstructorNote` with an explicit `Instructor note` label and clear audience/timing metadata when present.
- [x] Keep instructor note content in the DOM; do not imply secure hiding.
- [x] Ensure instructor notes do not alter existing section progress calculations.
- [x] Add `instructor_note` to `SectionRenderer` dispatch and preserve the exhaustiveness check.
- [x] Add review-package component counts by type for valid lectures.
- [x] Add review-package resource link counts by lecture and classify each resource link as external or local.
- [x] Add detectable local resource-link status as `present`, `missing`, or `not_checked` where repository or package context allows it.
- [x] Add instructor-note presence by lecture.
- [x] Add review package Markdown text stating that hidden, instructor, and answer content is included for review.
- [x] Preserve source template inclusion and existing review package manifest fields.
- [x] Do not implement optional glossary indexes, copy actions, checklist bulk controls, review mode toggles, or cross-component anchors in this task.

## Expected Behavior

Instructor guidance travels with rendered lectures, print output, and static review packages. Review packages summarize advanced component usage, resource links, and instructor-note presence without fetching remote URLs or changing package commands.

## Verification Commands

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run package:review
```

## Cleanup Notes

- Remove generated review-package artifacts after manual verification unless they are already ignored and intentionally retained locally.
- Do not create remote network checks for resource links.
