# Task: Implement QuestionSet Component

## Goal

Render `question_set` as an accessible learner-facing assessment card with local option selection, per-question reveal controls, and preview-only option shuffling.

## Dependencies

- `011-stronger-assessments-01-types-anchors.md`
- `011-stronger-assessments-02-validation-normalization.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/QuestionSet.tsx` - New client component.
- `tests/lecture-template/lecture-components.test.tsx` - Static markup, labels, ids, escaping, and print hook assertions.
- `tests/lecture-template/assessment-interaction.test.tsx` - New jsdom interaction tests for question sets.

## Checklist

- [x] Create `QuestionSet.tsx` with `"use client"`.
- [x] Render a single card with `id={component.anchor}`, a visible `Assessment: Question set` label, title, optional instructions, and all questions.
- [x] Use native radio inputs grouped per question and track selected values in local component state only.
- [x] Add per-question reveal buttons with `aria-expanded` and `aria-controls`.
- [x] Keep answer and optional feedback mounted in normal reading order but hidden until reveal on screen.
- [x] Implement `shuffle_options` only after mount to avoid hydration mismatch; server/static markup must preserve authored order.
- [x] Track selected state by question index plus authored option text so shuffled order does not break answer comparison.
- [x] Add a no-JavaScript message matching the existing quiz pattern.
- [x] Add tests for independent per-question reveal state and independent state across multiple question sets.
- [x] Add a shuffle test proving selected option state still maps to the authored answer after options are shuffled.
- [x] Add escaping tests for question, option, answer, and feedback text.

## Expected Behavior

- Learners can select one local option per question before revealing answer/feedback.
- Reveal controls pace feedback without implying grading or persistence.
- Multiple question sets on one page do not share state.
- Print styling hooks are present so answers and feedback can be forced visible in print.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/assessment-interaction.test.tsx
```

Run `npm run typecheck` after `011-stronger-assessments-08-rendering-index-answer-key.md`, when all new components are wired through `SectionRenderer`.

## Cleanup Notes

- jsdom tests should call `cleanup()` through the existing test pattern.
- This task should not create persistent data.
