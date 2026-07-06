# Task 09: Update Examples, Docs, and Review Guidance

## Goal

Update documentation and examples to reflect new UI/UX behavior.

## Files to Create/Modify

- **Modify**: `README.md`
- **Modify**: `SKILL.md`
- **Modify**: `examples/component-demo.template.md`

## Checklist

- [ ] Update README.md to describe:
  - Collection start/resume/continue behavior
  - Collection lecture previous/back/next navigation
  - Local-only progress and assessment feedback
  - Quiz selection/check behavior
  - Review status as secondary learner-facing UI
  - Static export and print behavior
- [ ] Update SKILL.md similarly
- [ ] Update examples/component-demo.template.md wording only where describing stale quiz behavior
- [ ] Keep authoring schema examples unchanged unless wording is stale
- [ ] Ensure documentation is clear and concise

## Expected Behavior

Documentation should:
1. Accurately reflect new collection CTA behavior
2. Describe lecture-to-lecture navigation
3. Explain quiz selection/feedback interaction
4. Clarify review status is secondary
5. Maintain existing examples unless outdated

## Verification Command(s)

```bash
npm run build
npm run validate
```

## Cleanup Notes

- No data cleanup required
- Ensure no breaking changes to authoring schema documentation
