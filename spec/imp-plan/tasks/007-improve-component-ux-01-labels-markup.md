# Task: Labels And Accessible Markup

## Goal

Lock down the visible label contract and improve component markup where it directly affects accessibility, teaching clarity, and static rendering.

## Dependencies

- Finalized plan: `spec/imp-plan/007-improve-component-ux-plan.txt`
- Baseline learning components from the `006-core-engine-learning-components` work must be present.

## Exact Files To Create Or Modify

- `src/components/lecture-kit/StepList.tsx` - Change the visible label from `Step list` to `Step-by-step`.
- `src/components/lecture-kit/Quiz.tsx` - Change the visible label to include `Quiz`, preferably `Quiz: Knowledge check`, and strengthen the static quiz structure.
- `src/components/lecture-kit/Comparison.tsx` - Strengthen value-to-topic/side accessibility relationships.
- `src/components/lecture-kit/Quote.tsx` - Read and preserve existing semantic `blockquote` plus `figcaption` behavior; modify only if needed to keep attribution attached.
- `src/components/lecture-kit/Callout.tsx`, `ConceptCard.tsx`, `CodeBlock.tsx`, `Summary.tsx` - Read for label consistency; modify only if current markup violates the finalized plan.
- `src/lib/lecture-template/types.ts` - Modify only if a backward-compatible internal accessibility helper is required; do not change schema or authored fields.
- `src/lib/lecture-template/validateTemplate.ts` - Do not change validation semantics.

## Checklist

- [ ] Update `StepList.tsx` so the visible component label is exactly `Step-by-step`.
- [ ] Update `Quiz.tsx` so the visible component label contains `Quiz`, preferably exactly `Quiz: Knowledge check`.
- [ ] Keep all component labels visible in rendered DOM, not only in `aria-label`.
- [ ] In `Quiz.tsx`, make the question the strongest heading/content in the card.
- [ ] Keep quiz options in an ordered list.
- [ ] Ensure the quiz answer key is in a clearly labeled static region below the options.
- [ ] Add static wording such as `Static answer key` only if needed to avoid implying hidden or secure assessment behavior.
- [ ] In `Comparison.tsx`, choose one finalized-plan-compliant accessibility approach:
  - semantic table markup with `caption` or visible heading, row headers, and `th scope` for side/topic labels; or
  - existing grid-style markup with explicit `id` plus `aria-labelledby`/`aria-describedby` relationships tying each value to its row topic and side label.
- [ ] Confirm each comparison value is programmatically associated with both its row topic and its left/right side label.
- [ ] Preserve `Quote.tsx` semantic `blockquote` markup and `figcaption` attribution when present.
- [ ] Do not use `dangerouslySetInnerHTML`.
- [ ] Do not add new component types, required fields, grading, persistence, runtime network access, or JavaScript-dependent quiz behavior.

## Expected Behavior

- Rendered labels are user-facing and unambiguous for all supported components:
  `Note callout`, `Warning callout`, `Insight callout`, `Concept card`, `Step-by-step`, `Code example`, `Comparison`, `Section summary`, `Source quote`, and `Quiz: Knowledge check` or another visible quiz label containing `Quiz`.
- Quiz renders as a static teaching check with question, ordered options, answer key, answer, and optional explanation visibly separated.
- Comparison values remain understandable to screen readers because each value has programmatic context for its row topic and side.
- Existing authoring schema, normalized model, validation behavior, route behavior, and static package behavior are unchanged.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- If manual fixture edits are used while exploring markup, restore them before finishing.
- Do not revert unrelated uncommitted work in component, schema, validation, example, or test files.
