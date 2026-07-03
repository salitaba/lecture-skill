# Task: Documentation Updates

**Goal**: Document the multi-lecture workflow in the skill guide and repository README without removing the existing single-lecture workflow.

**Dependencies**: Tasks 1 to 9

## Files to Create/Modify

- `SKILL.md`
- `README.md`

## Checklist

### SKILL.md updates
- [ ] Add a `Multi-Lecture Collection Workflow` section
- [ ] Describe the `lectures/` directory structure and numbered subdirectory ordering
- [ ] Explain how collection validation works and how an AI agent should scaffold a collection from an outline
- [ ] Preserve the existing single-lecture workflow instructions and example prompt

### README.md updates
- [ ] Add a `Multi-Lecture Collections` section
- [ ] Document the directory structure, root landing page, and `/lectures/<slug>` routes
- [ ] Explain collection validation and the precedence rule when `lectures/` exists
- [ ] Link to `examples/multi-lecture/`

## Expected Behavior

- The repo documents both workflows clearly
- Readers can see how to author and validate a collection without losing the single-lecture path
- The precedence rule is explicit: collection mode wins when `lectures/` exists

## Verification

```bash
npm run lint
npm run build
```

## Notes

- Keep the docs aligned with the task files and the plan wording; do not introduce new product requirements
- Preserve the current single-lecture examples and golden workflow guidance
