# Task: Docs And Agent Guidance

## Goal

Update human and AI-agent documentation so component labels, demo usage, and static quiz behavior match the improved UX contract.

## Dependencies

- `007-improve-component-ux-01-labels-markup.md`
- `007-improve-component-ux-03-component-demo-gallery.md`

## Exact Files To Create Or Modify

- `README.md` - Update component authoring docs, visible labels, demo instructions, and quiz behavior.
- `SKILL.md` - Update AI-agent authoring guidance for supported components and static quiz behavior.
- `examples/component-demo.template.md` - Modify only if documentation review finds stale demo wording.
- `docs/` files - Modify only if stale component support or demo wording exists there.

## Checklist

- [ ] In `README.md`, distinguish YAML type `step_list` from the visible label `Step-by-step`.
- [ ] Replace stale visible-label wording such as `Step list` where it describes rendered UI.
- [ ] Document the quiz visible label as `Quiz: Knowledge check` or equivalent wording containing `Quiz`.
- [ ] State that `quiz` renders as a static teaching check with a visible answer key.
- [ ] State that `quiz` is not secure assessment, grading, tracking, hidden-answer behavior, learner accounts, or analytics.
- [ ] Document when to use and when not to use each component.
- [ ] Ensure docs no longer imply that any supported component is missing, unsupported, or deferred.
- [ ] In `SKILL.md`, list all supported components: `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, and `quiz`.
- [ ] In `SKILL.md`, instruct agents that quiz examples should be visibly recognizable as quizzes and include static visible answer-key behavior.
- [ ] Keep documentation aligned with existing authoring schema; do not document new fields or component types.
- [ ] Run the stale-language search before finishing and resolve or intentionally account for each hit.

## Expected Behavior

- README and agent guidance match the rendered labels and current supported component set.
- Authors understand `quiz` is supported and intentionally exposes a static answer key.
- Agents author component examples using the correct visible-label expectations without changing schema.

## Verification Commands

```bash
rg -n "Knowledge check|Step list|Step-by-step|Quiz|component demo|unsupported component|deferred|comparison|summary|quote" README.md SKILL.md docs examples tests src
npm run validate
```

## Cleanup Notes

- This task should not create temporary data.
- Do not edit production or test files from this task unless the stale-language search exposes comments or test names that must be updated as part of documentation alignment.
