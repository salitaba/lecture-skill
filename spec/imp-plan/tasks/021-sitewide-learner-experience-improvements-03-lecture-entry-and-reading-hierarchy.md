# Task 03: Quiet Lecture Entry, Navigation, Progress, and Reading Surfaces

## Goal

Reduce competing lecture-entry chrome while preserving orientation, truthful progress, stable bottom navigation, and comfortable long-form reading width across desktop and mobile.

## Dependencies

- Complete Tasks 01–02 so facts and collection state are already using the new hierarchy.
- Keep the existing native anchors, browser history, section `IntersectionObserver`, progress persistence, and `LectureNavigation` three-slot contract.

## Exact Files to Create or Modify

- **Modify**: `src/components/lecture-kit/LecturePage.tsx`
- **Modify if needed**: `src/components/lecture-kit/LectureNavigation.tsx`
- **Modify**: `src/components/lecture-kit/progress/LectureProgressBar.tsx`
- **Modify if needed**: `src/components/lecture-kit/SectionRenderer.tsx`
- **Modify**: `src/app/globals.css`
- **Modify**: `tests/lecture-template/progress-ui-enhancement.test.tsx`
- **Modify**: `tests/lecture-template/lecture-navigation.test.tsx`
- **Modify**: `tests/lecture-template/collection-lecture-navigation.test.tsx`
- **Modify**: `tests/lecture-template/visual-hierarchy.test.tsx`

## Checklist

- [x] Replace the detached top back/next pill row with a quiet back breadcrumb adjacent to the lecture heading; do not render a top next action.
- [x] Keep the complete previous/course/next `LectureNavigation` after the lesson, preserving first/middle/last labels, desktop grid slots, and mobile reading order.
- [x] In `LectureProgressBar`, render stable loading status before provider hydration instead of numerical zero.
- [x] Hide reset and the `Alt+R` hint when confirmed completed sections are zero; show reset only when there is work to reset, and keep the existing confirmation and keyboard shortcut behavior.
- [x] Use concise completion copy at 100% while preserving the accessible progressbar and storage-unavailable indication.
- [x] Do not change `ProgressProvider` keys, schema, persistence, confirmation semantics, or announcements; only consume its existing `loaded`/`storageAvailable` values.
- [x] Add a semantic prose-measure token (approximately `72ch`) and apply it to ordinary paragraphs, lists, captions, and explanation copy in lecture reading regions.
- [x] Opt code, tables, diagrams, comparisons, timelines, and other explicitly wide structures out of the prose measure so they can use available content width.
- [x] Add a quiet surface modifier for overview/objectives/top-level reading regions without changing global `Card` semantics or weakening interactive assessment/callout emphasis.
- [x] Tighten mobile breadcrumb, progress, facts, and end-pager rules so long labels do not form awkward side-by-side rounded pills; preserve 44px control sizing.
- [x] Extend tests for loading/zero/complete progress, reset visibility, top breadcrumb placement, bottom pager ordering, and preserved anchor/history behavior.

## Expected Behavior

- A lecture title is followed by one nearby back-to-course affordance, not a second primary-looking next CTA row.
- Learners retain full previous/course/next navigation at the end of the lesson, with predictable labels and order for every collection position.
- Progress never displays a false zero while hydrating; reset appears only when it can perform useful work.
- Ordinary lecture prose is readable at roughly 65–75 characters per line on wide screens, while technical wide content remains usable.
- Overview/objectives and adjacent reading surfaces feel like one reading flow with fewer unnecessary container boundaries.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/progress-ui-enhancement.test.tsx tests/lecture-template/lecture-navigation.test.tsx tests/lecture-template/collection-lecture-navigation.test.tsx tests/lecture-template/visual-hierarchy.test.tsx
npm run typecheck
```

## Cleanup Notes

- Tests that exercise lecture progress must clear the lecture progress localStorage key and restore `window.confirm`/storage mocks.
- Do not add scroll-jacking, custom route state, new progress schemas, or new navigation destinations.
- Keep print/no-JavaScript anchor behavior intact; any new CSS classes must remain semantic-token based.
