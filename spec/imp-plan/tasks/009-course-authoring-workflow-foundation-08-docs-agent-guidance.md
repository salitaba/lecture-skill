# Task: Documentation And Agent Guidance

## Goal

Document course metadata, scaffold commands, JSON validation, doctor readiness, and the updated AI-agent authoring workflow.

## Dependencies

- `009-course-authoring-workflow-foundation-01-course-metadata.md`
- `009-course-authoring-workflow-foundation-02-validation-json-cli.md`
- `009-course-authoring-workflow-foundation-06-scaffold-commands.md`
- `009-course-authoring-workflow-foundation-07-doctor-command.md`

## Exact Files To Create Or Modify

- `README.md` - Update user-facing authoring workflow docs.
- `SKILL.md` - Update AI-agent workflow guidance.
- Optionally `examples/multi-lecture/README.md` - Update only if needed to mention `course.yaml`.

## Checklist

- [x] Document `lectures/course.yaml` path and P0 fields.
- [x] State that course metadata is optional and separate from lecture frontmatter.
- [x] Document `npm run new:collection`.
- [x] Document `npm run new:lecture`.
- [x] Document `npm run validate -- --json`.
- [x] Document `npm run doctor` and its exit semantics.
- [x] Explain where metadata appears: landing page, source worksheet, review package manifests.
- [x] Update `SKILL.md` so agents prefer scaffold commands for new authoring.
- [x] Update `SKILL.md` so agents use JSON validation when revising from machine-readable feedback.
- [x] Search for stale guidance that says collection identity is only inferred.

## Expected Behavior

- Educators can discover the new authoring workflow from `README.md`.
- AI agents have explicit instructions for metadata, scaffolding, validation JSON, and doctor checks.
- Existing lecture template schema documentation remains intact.

## Verification Commands

```bash
rg -n "course.yaml|new:collection|new:lecture|--json|doctor|collection identity|inferred" README.md SKILL.md examples docs
npm run validate
```

## Cleanup Notes

- Do not rewrite unrelated documentation.
- Keep examples aligned with implemented command names and P0 metadata fields.
