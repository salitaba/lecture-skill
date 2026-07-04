# Task: Examples, README, And Skill Guidance

**Goal**: Update author-facing examples and guidance so humans and AI agents can use the four new supported components correctly.

**Dependencies**: `006-core-engine-learning-components-02-schema-validation-implementation.md`, `006-core-engine-learning-components-04-render-components-styles.md`

## Exact Files To Create Or Modify

- `examples/component-demo.template.md` - Add representative valid examples for every supported component.
- `README.md` - Update supported component documentation, YAML shapes, examples, and non-goal language.
- `SKILL.md` - Update AI-agent authoring instructions and supported component guidance.
- `docs/` - Modify only current user-facing docs if the stale-language search finds text that would confuse implementers or authors.

## Checklist

- [x] Update `examples/component-demo.template.md` so it demonstrates `callout`, `concept_card`, `step_list`, `code_block`, `comparison`, `summary`, `quote`, and `quiz`.
- [x] Keep the component demo synthetic, source-neutral, and consistent with existing example style.
- [x] Keep all new component blocks inside `## Section:` blocks.
- [x] In `README.md`, replace old deferred-component warnings with the current supported component list.
- [x] Document `comparison` for two-sided contrasts.
- [x] Document `summary` for local section recap.
- [x] Document `quote` only for short source-grounded excerpts or named statements.
- [x] Document `quiz` as a static teaching check, not secure assessment.
- [x] Include exact YAML authoring shapes and optional fields for the new components.
- [x] State that unsupported custom component types still fail validation.
- [x] In `SKILL.md`, update the supported component list and usage guidance.
- [x] Warn AI agents not to invent custom component types.
- [x] Warn AI agents to use `quote` only when source-grounded and short.
- [x] Run the stale-language search from the plan and update current docs/examples as needed:

```bash
rg -n "comparison|summary|quote|quiz|MVP|deferred|unsupported component type" README.md SKILL.md docs examples
```

- [x] Do not rewrite historical spec files or implementation-plan archives unless a current task file would otherwise confuse implementers.

## Expected Behavior

- The component demo validates and renders all supported components.
- README and `SKILL.md` describe the same schema that validation accepts.
- AI agents following `SKILL.md` stop treating `comparison`, `summary`, `quote`, and `quiz` as unsupported.
- Quiz documentation is clear that it is a teaching check, not a secure assessment or tracking system.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/fixtures.test.ts
npm run lint
```

## Cleanup Notes

- Keep documentation changes limited to current author-facing guidance.
- Do not edit production or test code in this task unless verification exposes a doc/example mismatch that requires a coordinated fix from an earlier task.
