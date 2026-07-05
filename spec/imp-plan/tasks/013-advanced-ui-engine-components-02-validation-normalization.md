# Task: Add Advanced Component Validation And Normalization

## Goal

Teach the template validator to accept, validate, normalize, and reject malformed advanced UI engine components while preserving all existing component behavior.

## Dependencies

- `013-advanced-ui-engine-components-01-types.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/validateTemplate.ts` - Extend supported component names, component-specific validation, URL validation, defaults, and normalization.
- `tests/lecture-template/validateTemplate.test.ts` - Add or update focused validation and normalization coverage if this task implements tests alongside the validator.
- `tests/lecture-template/render-model.test.ts` - Add normalized render-model assertions if this file owns component shape coverage.

## Checklist

- [x] Add all ten new component names to `supportedComponents` and keep `isMeaningfulSectionBlock` aligned.
- [x] Reuse existing string, list, nested mapping, locator, and error helper patterns where possible.
- [x] Validate `glossary_term.term` and `glossary_term.definition`; reject empty optional `context` and empty `aliases` entries.
- [x] Validate `tabs.title`, require at least two panels, require non-empty panel `label` and `content`, reject duplicate labels, and reject `default_tab` unless it matches a panel label.
- [x] Validate `accordion.title`, require at least one item with non-empty `title` and `body`, reject invalid `default_open`, and reject duplicate item titles when `default_open` is present.
- [x] Validate `timeline.title`, require at least two items with non-empty `label` and `detail`, reject invalid `orientation`, and reject empty optional item `date`.
- [x] Validate `checklist.title`, require at least one non-empty string item, and reject `storage` values outside `session` and `local`.
- [x] Validate `flashcard.prompt` and `flashcard.answer`; reject empty optional `hint` and `category`.
- [x] Validate `worked_example.title`, `problem`, non-empty `walkthrough`, `solution`, and non-empty optional starter/takeaway fields.
- [x] Validate `mistake_correction.title`, `mistake`, `why_it_fails`, `correction`, and non-empty optional before/after examples.
- [x] Validate `resource_links.title`, require at least one link, require link `label` and `url`, and reject unsafe or malformed URL values.
- [x] Allow `resource_links.url` only for `http:`, `https:`, root-relative paths, relative local paths, and hash references.
- [x] Reject `javascript:`, protocol-relative URLs, empty URLs, and malformed absolute URLs.
- [x] Validate `instructor_note.title`, `body`, and optional `audience` in `instructor | reviewer | both`.
- [x] Ensure each validation error includes `code`, `message`, `locator`, `sectionTitle`, `componentType`, and specific `field` when applicable.
- [x] Normalize strings by trimming, preserve authored order, omit absent optional fields, and apply defaults for `checklist.storage`, `timeline.orientation`, and `instructor_note.audience`.
- [x] Ignore unknown component fields unless they conflict with a known field's expected type.

## Expected Behavior

Valid advanced components pass validation only inside `## Section:` blocks. Malformed fields produce author-locatable validation errors, and normalized components are render-ready with trimmed values, default values, and preserved authored order.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/render-model.test.ts
```

Run `npm run typecheck` after renderer dispatch is complete in `013-advanced-ui-engine-components-04-p1-rendering.md`.

## Cleanup Notes

- This task should not create temporary data.
- Do not modify renderer components, CSS, examples, documentation, or review-package code in this task.
