# Task: Update Documentation And Agent Guidance

## Goal

Document the ten advanced components for educators, reviewers, and AI agents without changing implementation behavior.

## Dependencies

- `013-advanced-ui-engine-components-02-validation-normalization.md`
- `013-advanced-ui-engine-components-03-p0-rendering.md`
- `013-advanced-ui-engine-components-04-p1-rendering.md`
- `013-advanced-ui-engine-components-05-instructor-review-package.md`
- `013-advanced-ui-engine-components-07-examples-fixtures.md`

## Exact Files To Create Or Modify

- `README.md` - Add authoring examples, component selection guidance, local-state warnings, hidden-content warnings, print behavior, and review-package behavior.
- `SKILL.md` - Update lecture generation guidance with a compact component chooser, field summaries or snippets, and warnings not to invent unsupported types.

## Checklist

- [x] Add concise authoring examples for all ten advanced components.
- [x] Explain when to use each component versus plain Markdown.
- [x] State that hidden, collapsed, answer, and instructor content is not secure and is visible in source, print, and review packages.
- [x] State that checklist state is local only and is never synced, submitted, exported, graded, or included in review packages.
- [x] Document resource link URL rules and clarify that rendering does not fetch external resources.
- [x] Document print behavior for tabs, accordion, flashcard, checklist, worked examples, mistake corrections, resource links, and instructor notes.
- [x] Document review package summaries for component counts, resource links, and instructor notes.
- [x] Update `SKILL.md` with a component chooser for AI-generated lectures.
- [x] Tell agents not to invent unsupported component types, unsafe HTML, arbitrary plugins, LMS behavior, analytics, grading, or runtime AI tutoring.
- [x] Keep examples aligned with the finalized schema and fixtures.

## Expected Behavior

Educators can author the new components from documentation, and AI agents have explicit guidance for choosing supported schema components instead of inventing unsupported Markdown or React structures.

## Verification Commands

```bash
npm run validate
npm run lint
```

## Cleanup Notes

- This task should not create temporary data.
- Do not modify production code or tests unless documentation examples expose a schema mismatch that must be fixed in an earlier task.
