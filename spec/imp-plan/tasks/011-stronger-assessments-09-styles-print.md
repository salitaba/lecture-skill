# Task: Add Assessment Styles And Print Behavior

## Goal

Style stronger assessments, the course assessment index, and the answer-key appendix so they are readable, accessible, responsive, and print-friendly.

## Dependencies

- `011-stronger-assessments-05-question-set-component.md`
- `011-stronger-assessments-06-free-response-component.md`
- `011-stronger-assessments-07-practice-task-component.md`
- `011-stronger-assessments-08-rendering-index-answer-key.md`

## Exact Files To Create Or Modify

- `src/app/globals.css` - Add shared assessment, option, reveal, textarea, rubric, starter-code, index, appendix, responsive, focus, and print styles.
- `tests/lecture-template/lecture-components.test.tsx` - Add class/hook assertions only where static markup contracts need coverage.

## Checklist

- [x] Add shared styles for `.assessment-card`, `.assessment-region`, `.assessment-reveal-button`, `.assessment-hidden-region`, `.assessment-options`, `.assessment-option`, `.assessment-textarea`, `.practice-rubric`, `.practice-starter-code`, `.assessment-index`, and `.answer-key-appendix`.
- [x] Use the existing visual language, colors, and card radius conventions; keep assessment cards distinct but calm.
- [x] Avoid nested card styling inside assessment cards; use dividers, headings, and spacing.
- [x] Make radio selections visible without relying only on color.
- [x] Ensure buttons are at least 44px tall and have visible focus states.
- [x] Ensure all text wraps at phone widths and long starter code scrolls inside its block.
- [x] Add print rules that hide reveal buttons and no-script helper text.
- [x] Add print rules that show answer, feedback, guidance, hints, solutions, rubrics, and the answer-key appendix.
- [x] Avoid splitting short cards and answer-key entries across pages when practical.
- [x] Respect `prefers-reduced-motion` if any transitions are added.

## Expected Behavior

- Assessment components are readable at narrow widths and desktop widths.
- Hidden interactive regions are revealed in printed output with clear labels.
- The course assessment index and answer-key appendix fit the existing lecture-kit UI.
- Existing component styles are not regressed.

## Verification Commands

```bash
npm run lint
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- If manual browser or print checks require temporary content changes, restore `content/lecture.template.md` afterward.
- Do not leave screenshots or exported print artifacts in the repository.
