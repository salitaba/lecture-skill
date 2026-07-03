# 002 Improve UX - 05 Validation Screen

## Goal

Make the blocking validation screen more actionable while preserving existing validation behavior and showing the active template path on every error item.

## Dependencies

- `002-improve-ux-02-component-contract-tests.md`
- `002-improve-ux-03-anchor-route-contract.md`

## Exact Files To Create Or Modify

- `src/app/page.tsx`
- `src/components/lecture-kit/ValidationScreen.tsx`
- `src/lib/lecture-template/readTemplate.ts` only to import existing `ACTIVE_TEMPLATE_PATH`, not to duplicate or change it unless necessary
- `src/app/globals.css`
- `tests/lecture-template/lecture-components.test.tsx`

## Checklist

- [x] Import `ACTIVE_TEMPLATE_PATH` from `src/lib/lecture-template/readTemplate.ts` in `src/app/page.tsx`.
- [x] Pass the active template path into `ValidationScreen`.
- [x] Do not duplicate `"content/lecture.template.md"` as a default string in `ValidationScreen`.
- [x] Lead the screen with a concise summary containing the blocking error count and active template path.
- [x] Ensure every error item renders:
  - active template path
  - error message
  - error code
  - source area when derivable from existing fields or code
  - best available location/context
  - field, heading, section, and component when present
  - hint when present
- [x] Keep all validation details visible in plain HTML so authors can copy them into an AI-agent prompt.
- [x] Group errors by source area only if it can be derived without changing validator output and without hiding details.
- [x] Keep the validation screen blocking. Do not render partial lecture content for invalid templates.
- [x] Update tests so each rendered error item includes `Template: content/lecture.template.md` plus message, code, context/location, and hint expectations.

## Expected Behavior

- Invalid active templates still block the route.
- The summary tells authors how many blocking errors exist and which template path is active.
- Every validation error is self-contained enough to triage independently.
- The validator output shape and `npm run validate` behavior remain backward-compatible.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx tests/lecture-template/render-model.test.ts
npm run validate
```

## Cleanup Notes

- If you temporarily replace `content/lecture.template.md` with an invalid fixture to inspect the screen, restore the original active template before finishing.
- Stop any dev server started for manual inspection.
