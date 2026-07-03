# 002 Improve UX - 02 Component Contract Tests

## Goal

Add focused static React markup tests for the UX contract before or alongside implementation, using `renderToStaticMarkup` and existing Vitest patterns. These tests should cover behavior that does not require a browser.

## Dependencies

- `002-improve-ux-01-fixtures.md`

## Exact Files To Create Or Modify

- `tests/lecture-template/lecture-components.test.tsx` or an equivalent focused test file under `tests/lecture-template/`
- `tests/lecture-template/render-model.test.ts`
- `tests/lecture-template/testUtils.ts` only if a small shared fixture helper is needed

## Checklist

- [x] Add static-markup tests for `LectureHeader` rendering title, description, audience, duration, level, and a visible authored-section count.
- [x] Add static-markup tests for `SectionNavigation` rendering Overview, Learning Objectives, each authored section with visible numbering, and Key Takeaways.
- [x] Assert `SectionNavigation` uses real anchor hrefs for every destination and does not use `aria-current` while active-section tracking is deferred.
- [x] Assert navigation hrefs match the heading IDs rendered by the route or by a small shared test harness that uses the same constants.
- [x] Add static-markup tests for `ValidationScreen` rendering a summary, active template path, and each error item with template path, message, code, best available context fields, and hints.
- [x] Add focused component-kit tests where useful to prove callouts, concept cards, step lists, and code blocks expose readable role labels/content without raw HTML rendering.
- [x] Keep existing `renderMarkdown.test.tsx` raw HTML escaping expectations passing.
- [x] Avoid broad snapshots. Prefer explicit text, attribute, and escaped-markup assertions.

## Expected Behavior

- Tests describe the P0 UX contract without introducing browser-only requirements.
- Failing assertions point to specific component responsibilities: header metadata, complete anchor navigation, validation error details, or component role presentation.
- Tests do not force active-section tracking, progress bars, new schema fields, or new component types.
- These contract tests may be red immediately after this task and should pass after tasks 03 through 06 are complete.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx tests/lecture-template/renderMarkdown.test.tsx tests/lecture-template/render-model.test.ts
```

When running this task before implementation, record the expected failures instead of weakening the assertions. Rerun the same command after the dependent implementation tasks.

## Cleanup Notes

- This task should not create runtime data.
- If the test file name differs, update the verification command to the actual focused test path.
