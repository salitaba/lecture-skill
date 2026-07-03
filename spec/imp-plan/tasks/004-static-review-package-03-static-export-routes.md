# Task: Static Export Configuration And Routes

**Goal**: Make the existing Next.js routes compatible with environment-gated static export while preserving normal local authoring behavior.

**Dependencies**: `004-static-review-package-02-preflight-model.md`

## Files to Create/Modify

- `next.config.ts` — Add `LECTURE_REVIEW_EXPORT=1` static export configuration
- `src/app/page.tsx` — Remove forced dynamic behavior and keep single/collection rendering behavior
- `src/app/lectures/[slug]/page.tsx` — Add static params and dynamic route contract
- `.gitignore` — Add export/package outputs

## Checklist

- [x] Update `next.config.ts` so default `npm run dev` and `npm run build` config remains unchanged.
- [x] When `LECTURE_REVIEW_EXPORT=1`, set `output: "export"` and `trailingSlash: true`.
- [x] Use `distDir: ".next-review"` if a separate static-export build directory is implemented.
- [x] Remove `export const dynamic = "force-dynamic"` from `src/app/page.tsx`.
- [x] Remove `export const dynamic = "force-dynamic"` from `src/app/lectures/[slug]/page.tsx`.
- [x] Add `generateStaticParams()` in `src/app/lectures/[slug]/page.tsx` that scans the current collection and returns `{ slug }` for every lecture.
- [x] Add `export const dynamicParams = false` in `src/app/lectures/[slug]/page.tsx`.
- [x] Keep invalid-template validation screens available for normal local preview.
- [x] Do not hide static export failures when a collection route is missing from `generateStaticParams`.
- [x] Verify whether removing `force-dynamic` causes stale local preview content after template edits.
- [x] If stale preview behavior appears, add the smallest route/cache adjustment that is compatible with static export.
- [x] Add `.gitignore` entries for `out/`, `review-packages/`, and `.next-review/` if used.

## Expected Behavior

- `LECTURE_REVIEW_EXPORT=1 next build` can statically export the root page and collection lecture pages.
- Normal `npm run dev` still supports local authoring and template edits.
- Missing collection slugs fail through the static route contract instead of being silently omitted.
- Package outputs and static export staging outputs are ignored by git.

## Verification

```bash
npm run typecheck
npm run lint
LECTURE_REVIEW_EXPORT=1 npm run build
```

## Cleanup Notes

- If manual verification creates `out/` or `.next-review/`, remove only directories created during this verification.
- Do not remove a pre-existing user-owned `out/` directory; move it aside only with explicit user approval during implementation.
