# 002 Improve UX - 07 Final Verification

## Goal

Run the finite automated checks and record the manual viewport, keyboard, and validation-screen QA required by the finalized plan.

## Dependencies

- `002-improve-ux-01-fixtures.md`
- `002-improve-ux-02-component-contract-tests.md`
- `002-improve-ux-03-anchor-route-contract.md`
- `002-improve-ux-04-header-navigation.md`
- `002-improve-ux-05-validation-screen.md`
- `002-improve-ux-06-visual-responsive-polish.md`

## Exact Files To Create Or Modify

- `spec/imp-plan/tasks/002-improve-ux-07-final-verification.md` only if recording checklist results directly in this task file is the chosen project convention
- No production code or test code should be changed in this task unless verification exposes a defect; if it does, return to the owning earlier task and rerun this task afterward

## Checklist

- [x] Run `npm run validate` against the active template.
- [x] Run `npm run test`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Start `npm run dev`, perform the browser checks below, then stop the server.
- [x] Preview the active valid template at desktop width and confirm the first viewport shows title, purpose/description, audience, duration, level, and section count.
- [x] Copy `examples/ux-stress.template.md` to `content/lecture.template.md` for responsive checks, preserving the original active template first.
- [x] At 390px, record `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [x] At 768px, record `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [x] At 1280px, record `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [x] Confirm long code blocks and Markdown tables scroll inside their own containers rather than causing body-level overflow.
- [x] Confirm long metadata values, long navigation labels, and long section titles wrap without clipping or overlap.
- [x] Confirm the long lecture with at least 10 authored sections exposes the start of lecture content quickly on mobile because navigation is compact by default.
- [x] Confirm keyboard users can reach and activate all navigation links.
- [x] Confirm visible focus on all links and controls, including the mobile `<summary>` if used.
- [x] Confirm normal anchor navigation still works with JavaScript unavailable or without relying on client-side active tracking.
- [x] Temporarily replace `content/lecture.template.md` with an invalid fixture and confirm the blocking validation screen shows the summary, active template path, and self-contained error details.
- [x] Restore the original valid `content/lecture.template.md`.

## Expected Behavior

- All finite checks pass:
  - `npm run validate`
  - `npm run test`
  - `npm run lint`
  - `npm run typecheck`
- Manual browser QA confirms no body-level horizontal overflow at 390px, 768px, and 1280px using the long lecture fixture.
- Navigation, focus, validation, and component presentation meet the P0 acceptance criteria from the finalized plan.
- Any discovered defect is fixed in the owning earlier slice rather than patched opportunistically in final verification.

## Verification Commands

Finite commands:

```bash
npm run validate
npm run test
npm run lint
npm run typecheck
```

Manual preview command:

```bash
npm run dev
```

Start the dev server, perform viewport and keyboard checks, then stop the server.

## Cleanup Notes

- Preserve the original `content/lecture.template.md` before replacing it for UX stress or invalid-template checks.
- Restore the original active template before finishing.
- Stop the dev server.
- Do not commit `.next/`, coverage output, temporary fixture copies, or manual browser artifacts unless the project intentionally records them.
