# Task: Rendering Tests

## Goal

Update static React rendering tests so the component UX contract is enforced for labels, semantics, escaping, comparison accessibility, quiz structure, and `SectionRenderer` dispatch across all eight component types.

## Dependencies

- `007-improve-component-ux-01-labels-markup.md`

## Exact Files To Create Or Modify

- `tests/lecture-template/lecture-components.test.tsx` - Update and extend direct component and `SectionRenderer` tests.
- `src/components/lecture-kit/StepList.tsx` - Modify only to fix label or semantic defects exposed by tests.
- `src/components/lecture-kit/Quiz.tsx` - Modify only to fix label, ordered-list, answer-key, or escaping defects exposed by tests.
- `src/components/lecture-kit/Comparison.tsx` - Modify only to fix programmatic association defects exposed by tests.
- `src/components/lecture-kit/Quote.tsx` - Modify only to fix `blockquote` or attribution defects exposed by tests.
- `src/components/lecture-kit/CodeBlock.tsx` - Modify only to fix code escaping or visible language-label defects exposed by tests.
- `src/components/lecture-kit/SectionRenderer.tsx` - Modify only to fix missing dispatch coverage.

## Checklist

- [ ] Update existing assertions from `Step list` to `Step-by-step`.
- [ ] Update existing quiz assertions from `Knowledge check` to a visible label containing `Quiz`, preferably `Quiz: Knowledge check`.
- [ ] Add or refactor direct rendering assertions so every supported component visible label appears exactly as expected.
- [ ] Assert quiz renders the visible label, question, ordered options, answer-key label, answer, and optional explanation.
- [ ] Assert quote renders semantic `blockquote`.
- [ ] Assert comparison exposes both side labels and each row topic programmatically for each value.
- [ ] For comparison, assert the chosen accessibility contract directly:
  - table approach: caption or visible title plus `th scope` for topic/side labels; or
  - grid approach: explicit `id` and `aria-labelledby`/`aria-describedby` relationships connecting each value to topic and side.
- [ ] Assert code block escapes code text and preserves a visible language label.
- [ ] Add HTML-like escaping coverage for all eight component types: `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, and `quiz`.
- [ ] Assert no raw `<script>` or unsafe image markup is emitted.
- [ ] Extend the `SectionRenderer` dispatch test to render all eight supported component types in one section with surrounding Markdown.
- [ ] Assert the updated `Step-by-step` and `Quiz: Knowledge check` labels in the `SectionRenderer` output.
- [ ] Keep tests static and deterministic; do not add browser dependencies or runtime interaction.

## Expected Behavior

- Rendering tests fail if any supported component loses its visible label or dispatch branch.
- Quiz is tested as a static teaching component, not an interactive or secure assessment.
- Comparison accessibility is tested beyond visual adjacency.
- Escaping coverage proves React-rendered component fields do not inject raw HTML.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run typecheck
```

## Cleanup Notes

- This task should not create fixture files or temporary data.
- If production component fixes are needed, keep them limited to defects exposed by this task and do not change schema or validation behavior.
