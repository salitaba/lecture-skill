# Task: Visual Styles And Print Behavior

## Goal

Tighten the shared component visual system, long-content wrapping, internal overflow behavior, and P1 print styles for comparison, quote, and quiz.

## Dependencies

- `007-improve-component-ux-01-labels-markup.md`

## Exact Files To Create Or Modify

- `src/app/globals.css` - Update shared component styles, component-specific affordances, wrapping rules, internal overflow behavior, responsive rules, and print rules.
- `src/components/lecture-kit/Comparison.tsx` - Modify only if selected markup from task 01 needs class names or attributes for responsive/print styling.
- `src/components/lecture-kit/Quote.tsx` - Modify only if needed to keep attribution attached to the quote in print.
- `src/components/lecture-kit/Quiz.tsx` - Modify only if needed to expose stable answer-key hooks for styling or print.
- `src/components/lecture-kit/CodeBlock.tsx` - Modify only if caption/language wrapping needs markup hooks; preserve existing figure/caption semantics.

## Checklist

- [ ] Preserve the common `.lecture-component` base with `min-width: 0`, restrained radius/border, consistent padding, and section-friendly spacing.
- [ ] Keep component cards visually coherent without making every component look identical.
- [ ] Make callout variants distinct through label, border, and structure; warning must not rely on red alone.
- [ ] Keep concept cards visually distinct from callouts and summaries.
- [ ] Ensure step-list number badges stay aligned when long step text wraps.
- [ ] Ensure long step text does not overlap badges.
- [ ] Ensure code captions and language labels wrap.
- [ ] Ensure long code lines scroll inside `pre`, never at body/page level.
- [ ] Ensure comparison rows are readable on desktop and stack cleanly on mobile.
- [ ] Ensure summary styling is calmer than callouts and less dominant than final key takeaways.
- [ ] Ensure quote context, quote text, and attribution are visually distinct.
- [ ] Ensure quiz question, options, answer key, answer, and explanation are visually separated.
- [ ] Add targeted wrapping rules such as `overflow-wrap: anywhere` for component headings, labels, comparison values, quote text, quiz options, answers, and explanations.
- [ ] Keep body-level horizontal overflow prevented at 390px, 768px, and 1280px.
- [ ] Add targeted `@media print` coverage for comparison rows so they avoid awkward splitting when possible.
- [ ] Add targeted `@media print` coverage so quote attribution remains attached to the quoted text.
- [ ] Add targeted `@media print` coverage so the quiz answer key remains visible and clearly labeled.
- [ ] Avoid print-only content that changes the static teaching meaning.

## Expected Behavior

- Components have clear teaching roles without visual noise.
- Long authored content wraps or scrolls internally inside its component.
- No component creates body-level horizontal overflow at phone, tablet, or desktop widths.
- Print preview keeps comparison, quote, and quiz understandable; quote attribution remains attached and quiz answer key remains visible.

## Verification Commands

```bash
npm run lint
npm run build
```

Manual CSS verification:

```bash
rg -n "@media print|comparison|quote|quiz|overflow-wrap|overflow-x|pre" src/app/globals.css
```

Manual preview command:

```bash
npm run dev
```

At 390px, 768px, and 1280px, run:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Also inspect print preview for comparison, quote, and quiz.

## Cleanup Notes

- Stop the dev server after manual checks.
- If `content/lecture.template.md` is temporarily replaced to preview the component demo, restore the original file before finishing.
- Do not commit browser-generated artifacts or temporary review/package output from manual checks.
