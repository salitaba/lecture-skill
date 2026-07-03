# 001 Lecture Site Engine - 05 App Route And Validation Screen

## Goal

Wire the Next.js root route to read the active local template on every preview render, share the validator path with the CLI, and render a blocking validation screen instead of partial lecture content.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`
- `001-lecture-site-engine-03-validator.md`
- `001-lecture-site-engine-04-validation-fixtures-cli.md`

## Exact Files To Create Or Modify

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/lecture-template/readTemplate.ts`
- `src/components/lecture-kit/PageShell.tsx`
- `src/components/lecture-kit/LectureHeader.tsx`
- `src/components/lecture-kit/SectionNavigation.tsx`
- `src/components/lecture-kit/SectionRenderer.tsx`
- `src/components/lecture-kit/ValidationScreen.tsx`
- `tests/lecture-template/render-model.test.ts` or equivalent non-browser integration test

## Checklist

- [x] Implement `src/app/page.tsx` as a server component.
- [x] Read `content/lecture.template.md` through `readTemplate.ts` using Node-only file access.
- [x] Force dynamic rendering for the route, for example with `export const dynamic = "force-dynamic"` or an equivalent documented Next.js setting.
- [x] Reuse the same parser and validator used by `scripts/validate.ts`.
- [x] Render `ValidationScreen` when validation fails.
- [x] Ensure `ValidationScreen` lists all detected validation errors with problem, locator/context, field/heading/section/component data, and hint when available.
- [x] Render no partial lecture content on validation failure.
- [x] Render lecture metadata through `LectureHeader` when validation passes.
- [x] Render ordered section navigation through `SectionNavigation` when validation passes.
- [x] Render overview, objectives, sections, and takeaways in order.
- [x] Generate navigation entries from the normalized section list, including unique anchors for duplicate section titles.
- [x] Use semantic headings and landmarks where practical.
- [x] Add focused tests or component-model tests proving:
  - [x] invalid active content produces the validation-screen data path
  - [x] valid parsed templates produce nav entries for every section in order
  - [x] duplicate section titles link to distinct anchors

## Expected Behavior

- Local template edits are reflected during preview without a rebuild.
- Invalid templates block rendering and show a clear error list.
- Valid templates render metadata, navigation, overview, learning objectives, ordered sections, and key takeaways.
- Section navigation links every section in source order and handles duplicate titles correctly.

## Verification Commands

```bash
npm run validate
npm run test
npm run dev
```

Open `http://localhost:3000` and verify both a valid active template and an intentionally invalid active template produce the expected route behavior. Restore the valid active template after the check.

## Cleanup Notes

- If manually replacing `content/lecture.template.md` for route checks, save and restore the original active template.
- Stop the dev server after verification.
- Do not commit `.next/` output.
