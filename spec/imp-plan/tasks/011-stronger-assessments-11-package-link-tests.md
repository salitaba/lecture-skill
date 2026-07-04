# Task: Add Review Package And Route Link Tests

## Goal

Prove assessment anchors, answer-key appendix markup, and collection assessment links survive static rendering and review-package HTML rewriting.

## Dependencies

- `011-stronger-assessments-08-rendering-index-answer-key.md`
- `011-stronger-assessments-09-styles-print.md`
- `011-stronger-assessments-10-examples-docs-skill.md`

## Exact Files To Create Or Modify

- `tests/lecture-template/review-package.test.ts` - Add package rewriting and exported HTML assertions.
- `tests/lecture-template/lecture-navigation.test.tsx` - Add route/fragment assertions only if this file already owns route-link contracts.
- `src/lib/lecture-template/reviewPackage.ts` - Modify only if tests expose a rewriting gap for fragment links.

## Checklist

- [x] Add tests proving exported single-lecture HTML includes `answer-key-appendix` and assessment ids.
- [x] Add tests proving collection landing links use `/lectures/${slug}#${anchor}` for assessment index entries.
- [x] Add tests proving root package rewriting preserves fragment suffixes for `/lectures/<slug>#<anchor>` links.
- [x] Add tests proving plain same-page `#<anchor>` links are not rewritten incorrectly.
- [x] Add tests proving single-lecture mode does not emit broken `/lectures/...` assessment links.
- [x] Modify `rewriteExportedHtmlForFileProtocol` only if existing rewriting drops or corrupts fragment identifiers.
- [x] Keep existing package source snapshot and manifest behavior unchanged.

## Expected Behavior

- Review packages preserve all assessment content and fragment links needed for reviewer handoff.
- The answer-key appendix is present in static HTML and package output.
- Collection index links continue to work after package rewriting for direct file opening.

## Verification Commands

```bash
npm run test -- tests/lecture-template/review-package.test.ts
npm run test -- tests/lecture-template/lecture-navigation.test.tsx
npm run package:review
```

## Cleanup Notes

- Package tests create temporary directories and must remove them with existing `afterEach` cleanup.
- `npm run package:review` may create `review-packages/`; remove or ignore generated package output according to existing project workflow, and do not commit generated packages.
- Restore `content/lecture.template.md` if it was changed for manual package verification.
