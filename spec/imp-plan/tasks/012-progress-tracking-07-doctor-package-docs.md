# Task: Update Doctor, Review Package, README, And SKILL Guidance

## Goal

Document progress tracking and add CLI/review-package reporting that explains the localStorage behavior without claiming server-side inspection of browser state.

## Dependencies

- `012-progress-tracking-01-model-storage.md`
- `012-progress-tracking-03-lecture-ui.md`
- `012-progress-tracking-04-collection-ui.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/doctor.ts` - Add progress capability/reporting fields and rendered output.
- `tests/lecture-template/doctor.test.ts` - Doctor output coverage.
- `src/lib/lecture-template/reviewPackage.ts` - Add manifest/checklist/README progress notes if this is where package text is assembled.
- `tests/lecture-template/review-package.test.ts` - Package text/manifest coverage.
- `README.md` - Add progress tracking documentation.
- `SKILL.md` - Add authoring/agent guidance.

## Checklist

- [x] Add doctor output describing progress tracking as browser localStorage based.
- [x] Include expected storage key prefixes in doctor output.
- [x] Avoid trying to inspect real browser localStorage from Node.
- [x] Add review-package notes that progress state is not packaged, synced, exported, or shared.
- [x] Add reviewer verification guidance for toggling a section and inspecting localStorage.
- [x] Document single and collection storage schemas in README.
- [x] Document privacy, reset, corruption recovery, no-JavaScript fallback, and keyboard shortcuts.
- [x] Update SKILL guidance to say progress is automatic and authors should not invent progress template syntax.
- [x] Add focused tests for doctor and package text.

## Expected Behavior

Developers, educators, and reviewers can understand how progress tracking works, where it is stored, and how to verify it without confusing it for package or server state.

## Verification Commands

```bash
npm run test -- tests/lecture-template/doctor.test.ts
npm run test -- tests/lecture-template/review-package.test.ts
```

## Cleanup Notes

Do not add generated `review-packages/` output to the repository.
