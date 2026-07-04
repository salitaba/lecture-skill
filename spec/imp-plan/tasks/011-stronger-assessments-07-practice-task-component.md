# Task: Implement PracticeTask Component

## Goal

Render `practice_task` as an applied practice card with visible task material, visible self-evaluation rubric, and separate hint/solution reveals.

## Dependencies

- `011-stronger-assessments-01-types-anchors.md`
- `011-stronger-assessments-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/PracticeTask.tsx` - New client component.
- `tests/lecture-template/lecture-components.test.tsx` - Static markup, list semantics, starter-code escaping, ids, and print hook assertions.
- `tests/lecture-template/assessment-interaction.test.tsx` - jsdom interaction tests for hint and solution disclosures.

## Checklist

- [x] Create `PracticeTask.tsx` with `"use client"`.
- [x] Render `id={component.anchor}`, visible label `Practice task`, title, optional scenario, required task, optional steps, optional starter code, and optional rubric.
- [x] Render rubric visible by default as self-evaluation criteria.
- [x] Render hints behind `Show hints` / `Hide hints` when present.
- [x] Render solution behind `Show solution` / `Hide solution` when present.
- [x] Use separate `useId`-based ids for hints and solution regions.
- [x] Reuse `CodeBlock` for `starter_code` where practical by constructing a `CodeBlockComponent` object.
- [x] If a custom starter-code wrapper is necessary, add tests for escaping `<script>`-like text and long-code scrolling hooks.
- [x] Add no-JavaScript messaging and print-visible hooks for hints, solution, and rubric.
- [x] Add tests proving hint and solution reveal state is independent.
- [x] Add escaping tests for all text fields, starter code, and rubric text.

## Expected Behavior

- Learners see the applied task, steps, starter code, and rubric before revealing help.
- Hints and solution are separate pacing controls.
- Rubric reads as self-evaluation criteria, not hidden grading.
- Long starter code can be styled to scroll inside the component.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/assessment-interaction.test.tsx
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when all new components are wired through `SectionRenderer`.

## Cleanup Notes

- jsdom tests should use existing `cleanup()` patterns.
- This task should not create persistent data.
