# Task: Component Demo Gallery

## Goal

Upgrade `examples/component-demo.template.md` into the canonical visual gallery for every supported component and enough long-content cases to review wrapping and overflow.

## Dependencies

- `007-improve-component-ux-01-labels-markup.md`
- `007-improve-component-ux-02-visual-styles-print.md` is helpful for manual visual review but does not have to be complete before editing the fixture.

## Exact Files To Create Or Modify

- `examples/component-demo.template.md` - Expand and polish the component gallery.
- `content/lecture.template.md` - Temporarily replace only for manual single-lecture preview, then restore.
- Root `lectures/` directory - Do not create one for this task. If one exists and affects manual single-lecture preview, avoid changing it unless the implementation owner explicitly chooses a safe temporary move.

## Checklist

- [ ] Keep every component block inside `## Section:` blocks.
- [ ] Include every supported component type: `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, and `quiz`.
- [ ] Keep the demo synthetic and source-neutral.
- [ ] Add concise grouping in section titles or intro text, such as `Highlight`, `Structure`, `Evidence`, and `Check understanding`.
- [ ] Make rendered text easy to search for each component role, especially `Quiz`.
- [ ] Include realistic long-content comparison item labels.
- [ ] Include realistic long-content comparison left/right values.
- [ ] Include quote text, attribution, and context long enough to inspect wrapping and attachment.
- [ ] Include quiz question, options, answer, and explanation long enough to inspect wrapping and static answer-key treatment.
- [ ] Include code lines long enough to prove internal scrolling inside the code block.
- [ ] Preserve the authored schema and fenced `lecture-component` YAML syntax exactly; do not add new fields or component types.
- [ ] Run validation after editing the fixture.
- [ ] Preview the demo in single-lecture mode using the exact setup in the finalized plan.

## Expected Behavior

- `examples/component-demo.template.md` is the canonical valid visual gallery for the full supported component set.
- A reviewer can find and inspect all eight component types from rendered text.
- The demo exercises long-content behavior for comparison, quote, quiz, and code without requiring schema changes.
- The demo validates with the existing validation contract.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
```

Manual single-lecture preview setup:

```bash
cp content/lecture.template.md /tmp/lecture-template-before-component-demo.md
cp examples/component-demo.template.md content/lecture.template.md
npm run validate
npm run dev
```

Then inspect the local page. After preview:

```bash
cp /tmp/lecture-template-before-component-demo.md content/lecture.template.md
```

## Cleanup Notes

- Always save the original `content/lecture.template.md` before replacing it.
- Restore the original `content/lecture.template.md` after previewing.
- Stop the dev server after manual review.
- Do not leave temporary copies, generated packages, or preview artifacts in the repository.
- If root `lectures/` exists and changes route mode, do not delete or move it without confirming it is safe; record the blocker in the task result instead.
