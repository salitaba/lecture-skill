# Task 05: Make Dialogs and Theme Control Resilient Across Hydration

## Goal

Ensure notes, diagrams, and theme controls have predictable focus, close, persistence, and pre-hydration behavior while retaining native dialogs, Mermaid behavior, system theme fallback, and the existing `theme` storage key.

## Dependencies

- Complete Tasks 01–04 so shared focus and responsive styles are in place.
- Keep native `<dialog>` usage, existing note/diagram persistence paths, and Next media-based viewport theme colors as the system fallback.

## Exact Files to Create or Modify

- **Modify**: `src/components/lecture-kit/progress/SectionNote.tsx`
- **Modify**: `src/components/lecture-kit/Diagram.tsx`
- **Modify**: `src/components/lecture-kit/ThemeToggle.tsx`
- **Modify**: `src/app/layout.tsx`
- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/theme-toggle.test.tsx`
- **Modify**: `tests/lecture-template/section-note.test.tsx`
- **Modify**: `tests/lecture-template/diagram-inspection.test.tsx`

## Checklist

- [x] In `SectionNote`, retain the opener ref, focus the textarea after `showModal()`, and connect a stable title/description with `aria-labelledby`/descriptive semantics.
- [x] Save the current draft on explicit Close and native `cancel`/Escape before closing; keep existing blur/debounced persistence as a compatible additional path.
- [x] Restore focus to a connected opener after every close route without fighting native dialog behavior.
- [x] In `Diagram`, retain Mermaid lazy loading, error fallback, and download behavior while adding opener refs, labelled dialog title, initial focus on heading/first action, and focus restoration on close/cancel.
- [x] Keep native dialog semantics and jsdom `HTMLDialogElement` stubs compatible with existing tests.
- [x] Replace `ThemeToggle`’s `null` pre-hydration output with stable non-interactive placeholder chrome of the same 44×44 footprint; only expose the real button once theme state resolves.
- [x] Keep accessible theme button name, icon, and pressed state correct after hydration and toggle.
- [x] Add small theme DOM helpers (local or adjacent) to set `data-theme`, persist the existing `theme` key, and create/update an owned `meta[name="theme-color"]` override only for stored/manual choices.
- [x] Extend the layout before-paint script to apply the same stored-choice theme/color override; preserve media-based viewport colors when no manual choice exists.
- [x] Add tests for placeholder markup, post-hydration state, localStorage choice, document theme attribute, theme-color meta ownership/update, note Close/Escape persistence/focus return, and diagram focus return.

## Expected Behavior

- Opening a note or diagram moves focus into the dialog, and closing via button, Escape, or native cancel returns focus to the triggering control.
- Note edits are not lost when the dialog is closed through any supported route.
- The theme control reserves its layout footprint before hydration, never presents a misleading interactive control while unresolved, and updates document theme and browser chrome consistently after a manual/stored choice.
- System preference remains the fallback when there is no stored/manual theme choice; no new persistence schema is introduced.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/section-note.test.tsx tests/lecture-template/diagram-inspection.test.tsx tests/lecture-template/theme-toggle.test.tsx
npm run typecheck
```

## Cleanup Notes

- Reset `theme` localStorage, document `data-theme`, owned theme-color meta tags, and focus state between tests.
- Clear annotation drafts and restore `HTMLDialogElement`/`showModal`/`close` stubs after each note/diagram test.
- Do not change Mermaid loading, download, annotation key/schema, debounce timing, or viewport media fallback behavior.
