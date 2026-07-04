# Task: Static Render And Contract Tests

## Goal

Update existing static render tests so they assert the collapsed quiz disclosure contract without claiming answer source secrecy or changing parser and validator behavior.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md`
- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`

## Exact Files To Create Or Modify

- `tests/lecture-template/lecture-components.test.tsx` - Replace stale static-answer assertions with collapsed reveal markup assertions.
- `tests/lecture-template/validateTemplate.test.ts` - Read and run; modify only if stale wording from examples makes fixture expectations fail.
- `tests/lecture-template/fixtures.test.ts` - Read and run; modify only if fixture copy updates require expectation adjustments.
- `tests/lecture-template/parseTemplate.test.ts` - Read and run if failures appear; parser behavior should not change.
- `src/components/lecture-kit/SectionRenderer.tsx` - Read only; quiz dispatch should remain unchanged.

## Checklist

- [x] In `lecture-components.test.tsx`, replace the test name that describes quiz as a static teaching check.
- [x] Remove stale assertions for `Static answer key`.
- [x] Keep assertions for `Quiz: Knowledge check`, the quiz question, and `<ol class="quiz-options">`.
- [x] Assert static markup contains a `<button type="button">` reveal control.
- [x] Assert static markup contains `aria-expanded="false"`.
- [x] Assert static markup contains `aria-controls` and a matching answer-region `id`.
- [x] Assert the answer region is initially hidden.
- [x] Assert the answer region is labeled by a visible `Answer` label.
- [x] Do not assert the answer string is absent from static markup.
- [x] Keep React escaping coverage for HTML-like quiz fields.
- [x] Keep `SectionRenderer` dispatch coverage and update it to assert reveal-control text or attributes instead of old visible answer-key wording.
- [x] Run parser and validator tests to confirm schema and validation behavior remained unchanged.

## Expected Behavior

- Static render tests describe the server-rendered collapsed disclosure markup.
- The answer may still exist in static markup inside a hidden answer region.
- `SectionRenderer` still dispatches `quiz` blocks to `Quiz`.
- Parser, schema, and validator tests remain green without quiz contract changes.

## Verification Commands

```bash
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/parseTemplate.test.ts
npm run typecheck
```

## Cleanup Notes

- This task should not create test data.
- Do not modify fixtures just to hide answer text from source or static markup.
- Do not revert unrelated edits in existing test files.
