# Task: Collection Layout Styles

**Goal**: Add the shared collection-specific CSS in `src/app/globals.css` for the landing page, validation badges, and lecture navigation.

**Dependencies**: Tasks 3, 4, 5, and 7

## Files to Create/Modify

- `src/app/globals.css` — Add collection-specific styles

## Checklist

### globals.css additions
- [ ] Add `.collection-landing` container styles that match the existing page width rhythm
- [ ] Add `.collection-header` and `.collection-summary` styles for the course outline header area
- [ ] Add `.lecture-list` layout styles so entries stack cleanly at narrow widths and remain readable at 768px and 1280px
- [ ] Add `.lecture-list-item` styles that visually match the existing lecture panel treatment
- [ ] Add `.lecture-list-meta` grid styles for audience, level, duration, and section count
- [ ] Add `.lecture-list-link` title styles and visible focus states
- [ ] Add `.validation-badge`, `.validation-badge-pass`, and `.validation-badge-fail` styles with text that is not color-only
- [ ] Add `.lecture-nav`, `.lecture-nav-inner`, `.lecture-nav-link`, and `.lecture-nav-back` styles for the per-lecture navigation footer
- [ ] Preserve the existing border radius, border color, and focus-visible outline conventions used elsewhere in `globals.css`
- [ ] Add responsive rules at the existing 520px and 900px breakpoints so the list and navigation reflow without horizontal overflow

## Expected Behavior

- Collection landing rows and navigation links are readable at 390px, 768px, and 1280px
- Validation badges remain legible without relying on color alone
- Keyboard focus states are visible on all collection links
- The new collection layout does not introduce body-level horizontal scrolling

## Verification

```bash
npm run lint
npm run build
```

## Notes

- Do not introduce new design tokens unless the existing file already needs them; reuse the current palette and spacing scale
- This task only owns the shared CSS layer; the component tasks create the class names
