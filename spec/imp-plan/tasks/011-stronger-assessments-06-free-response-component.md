# Task: Implement FreeResponse Component

## Goal

Render `free_response` as a local-only written self-check with a labelled textarea and optional guidance reveal.

## Dependencies

- `011-stronger-assessments-01-types-anchors.md`
- `011-stronger-assessments-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/FreeResponse.tsx` - New client component.
- `tests/lecture-template/lecture-components.test.tsx` - Static markup, labels, ids, escaping, and print hook assertions.
- `tests/lecture-template/assessment-interaction.test.tsx` - jsdom interaction tests for local textarea and guidance reveal.

## Checklist

- [x] Create `FreeResponse.tsx` with `"use client"`.
- [x] Render `id={component.anchor}`, a visible `Assessment: Free response` label, title, prompt, and a labelled textarea.
- [x] Add helper text stating the learner response is local and not saved.
- [x] Use `component.placeholder` when present; otherwise use `Draft your response here...`.
- [x] When guidance exists, render it in an always-mounted region behind a `Compare your answer` / `Hide guidance` button.
- [x] Wire `aria-expanded` and `aria-controls` for the guidance disclosure.
- [x] Add a no-JavaScript message and print-visible guidance hook.
- [x] Add tests proving textarea input is local and does not require submit/save controls.
- [x] Add tests proving multiple free-response components maintain independent textarea and reveal state.
- [x] Add escaping tests for title, prompt, placeholder, and guidance text.

## Expected Behavior

- Learners can draft an answer locally before comparing it with model guidance.
- The UI does not imply grading, submission, persistence, analytics, or remote feedback.
- Printed output includes prompt and guidance through CSS hooks.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/assessment-interaction.test.tsx
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when all new components are wired through `SectionRenderer`.

## Cleanup Notes

- jsdom tests should use existing `cleanup()` patterns.
- This task should not create persistent data.
