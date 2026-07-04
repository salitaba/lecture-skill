# Task: Update Component Demo, SKILL.md, And Documentation

## Goal

Add diagram examples to the component gallery, update SKILL.md with diagram authoring guidance, and ensure documentation reflects the new component type.

## Dependencies

- `010-interactive-diagrams-flowcharts-03-validation.md` (diagram validation must pass for examples)
- `010-interactive-diagrams-flowcharts-05-section-renderer.md` (diagram renders through SectionRenderer)

## Exact Files To Create Or Modify

- `examples/component-demo.template.md` - Add a "Diagram Components" section with valid examples for each supported type.
- `SKILL.md` - Add `diagram` to the supported components list with authoring syntax and usage guidance.

## Checklist

### component-demo.template.md

- [x] Add a new `## Section: Diagram Components` after the existing "Check Understanding Components" section.
- [x] Add a paragraph explaining what diagrams are used for in technical education.
- [x] Add a valid `flowchart` diagram example with `graph LR` syntax.
- [x] Add a valid `sequence` diagram example.
- [x] Add a valid `class` diagram example.
- [x] Add a valid `state` diagram example.
- [x] Add a valid `er` diagram example.
- [x] Add a valid `gantt` diagram example.
- [x] Add a valid `pie` diagram example.
- [x] Add a valid `mindmap` diagram example.
- [x] Keep diagram `code` content short but syntactically valid for each type.
- [x] Add a key takeaway mentioning diagram support.

### SKILL.md

- [x] Add `diagram` to the supported components list (after the `quiz` section, line 211-223).
- [x] Include the authoring syntax example with `type`, `diagram_type`, `title`, and `code` fields.
- [x] Document optional `direction` field (flowchart only: `TB`, `LR`, `BT`, `RL`).
- [x] Document optional `theme` field (`default`, `dark`, `forest`, `neutral`, `base`).
- [x] Add "When to use diagram" guidance: architecture, process flow, sequence interaction, state machine, data model, timeline.
- [x] Add "When NOT to use diagram" guidance: simple lists, short text comparisons, single-step processes, content better suited to code blocks or step lists.
- [x] Rendered label is `Diagram`.

## Expected Behavior

- `npm run validate` passes with the updated component demo fixture.
- SKILL.md describes the diagram component with correct syntax and field names.
- The component demo shows all 8 supported diagram types as valid examples.

## Verification Commands

```bash
npm run validate
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/fixtures.test.ts
```

## Cleanup Notes

- This task should not create temporary data.
- If manual demo preview requires copying `examples/component-demo.template.md` to `content/lecture.template.md`, restore the previous `content/lecture.template.md`.
- Do not modify production code or tests except for fixture expectations caused by the demo changes.
