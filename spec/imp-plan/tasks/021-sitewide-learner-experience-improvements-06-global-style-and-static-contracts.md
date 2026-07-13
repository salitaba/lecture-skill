# Task 06: Consolidate Responsive, Theme, Print, and Static-Output Contracts

## Goal

Finish the cross-cutting visual and rendering work introduced by Tasks 01–05, keep all styles within the established semantic token system, and update contract tests for intentional hierarchy changes without weakening existing static/print guarantees.

## Dependencies

- Complete Tasks 01–05 so all semantic classes and state variants referenced by the stylesheet exist.
- Use the current `src/app/globals.css` token, motion, dark-mode, print, and component contracts as the baseline; do not add a CSS framework or raw per-component palette.

## Exact Files to Create or Modify

- **Modify**: `src/app/globals.css`
- **Modify**: `tests/lecture-template/visual-hierarchy.test.tsx`
- **Modify**: `tests/lecture-template/backward-compat.test.tsx`
- **Modify**: `tests/lecture-template/lecture-components.test.tsx`
- **Modify**: `tests/lecture-template/review-package.test.ts`

## Checklist

- [x] Consolidate `.facts-list`, course-description, reviewer-disclosure, loading/progress, breadcrumb, quiet-surface, prose-measure, focus, 44px-target, and mobile pager rules around semantic classes from earlier tasks.
- [x] Remove duplicate/outdated rules made obsolete by shared facts, quiet lecture entry, and state-aware progress; avoid broad selectors that affect unrelated teaching components.
- [x] Keep semantic teal/warm highlight tokens, light/dark mappings, typography, icon system, motion tokens, and reduced-motion behavior intact; do not introduce raw colors.
- [x] Preserve print behavior: interactive controls hidden where required, revealed/static content printable, and progress text legible without misleading interactive affordances.
- [ ] Verify narrow (390px), tablet (768px), and wide (1440px) layouts at 200% zoom/reflow with no horizontal page scrolling; ensure long facts/actions do not create jagged wraps.
- [x] Add/update contract-level static markup assertions for essential collection facts, no primary pass count, native full-description reachability, facts-list semantics, reviewer disclosure placement, quiet top navigation, and intentional hierarchy classes.
- [x] Keep no-JavaScript tab/diagram/static fallback assertions and generic overflow/accessibility checks intact; change only expectations directly tied to Spec 021 hierarchy.
- [ ] Check light/dark contrast for body/muted text, focus rings, selected tabs, progress, success/warning/disabled states, dialogs, and reviewer context.

## Expected Behavior

- The collection and lecture surfaces share one responsive visual language without card-soup or browser-default definition-list indentation.
- Wide prose is capped to the reading measure while code/tables/diagrams/comparisons remain wide and usable.
- Static exports and print output retain orientation and content when client state is absent; interactive-only chrome does not masquerade as content.
- Existing component-kit and teaching-component visual contracts remain stable outside deliberate Spec 021 changes.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/visual-hierarchy.test.tsx tests/lecture-template/backward-compat.test.tsx tests/lecture-template/lecture-components.test.tsx tests/lecture-template/review-package.test.ts
npm run lint
npm run build
```

## Cleanup Notes

- Remove only obsolete Spec 021 CSS selectors; do not delete unrelated styles or generated review-package artifacts.
- Keep test snapshots/fixtures deterministic and restore any viewport, media-query, reduced-motion, or print mocks after each test.
- No storage cleanup or schema migration is required.
