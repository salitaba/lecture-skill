# Task: Documentation, Agent Guidance, And Demo Copy

## Goal

Update project documentation, AI-agent guidance, and the component demo so they describe quiz reveal as an on-demand pacing interaction with unchanged schema, documented no-JavaScript behavior, and print-visible answers.

## Dependencies

- `008-improve-quiz-reveal-ux-01-component.md` should finalize the no-JavaScript fallback message and behavior.
- Finalized plan: `spec/imp-plan/008-improve-quiz-reveal-ux-plan.txt`

## Exact Files To Create Or Modify

- `README.md` - Update the `Quiz (quiz)` documentation and review instructions.
- `SKILL.md` - Update quiz authoring guidance for AI agents.
- `examples/component-demo.template.md` - Replace stale static-answer wording and tell reviewers to click `Show answer`.
- `tests/lecture-template/fixtures.test.ts` - Run only; modify only if demo fixture expectations need a narrow update.
- `tests/lecture-template/validateTemplate.test.ts` - Run only; modify only if demo fixture expectations need a narrow update.

## Checklist

- [x] In `README.md`, replace wording that says quiz renders a visible static answer key by default.
- [x] In `SKILL.md`, replace wording that says quizzes render a visible static answer key or are hidden-answer tests.
- [x] State in both docs that the quiz schema is unchanged: `question`, `options`, `answer`, and optional `explanation`.
- [x] State in both docs that interactive pages initially hide answer and explanation until the learner clicks `Show answer`.
- [x] State in both docs that the control toggles to `Hide answer`.
- [x] State in both docs that printed output includes answer and explanation by default.
- [x] State in both docs that the no-JavaScript fallback is the `<noscript>` message plus print availability.
- [x] State in both docs that reveal is not secure assessment, grading, tracking, answer encryption, anti-cheating, learner accounts, or analytics.
- [x] In `examples/component-demo.template.md`, replace "static answer-key behavior".
- [x] In `examples/component-demo.template.md`, replace "static teaching checks with a visible answer key".
- [x] In `examples/component-demo.template.md`, replace explanation text saying the rendered quiz shows a static answer key.
- [x] In `examples/component-demo.template.md`, replace the key takeaway saying quiz is a static teaching check with a visible answer key.
- [x] Add demo copy that tells reviewers to click `Show answer`.
- [x] Keep the same fenced YAML schema and valid quiz fields.
- [x] Keep long quiz question/options/explanation content so wrapping remains reviewable.
- [x] Search for stale wording before finishing.

## Expected Behavior

- Documentation and agent guidance match the implemented reveal UX.
- The component demo remains a valid lecture template and makes the reveal interaction easy to review.
- Docs clearly avoid promising security or answer secrecy.
- Reviewers know printed output includes answer and explanation without clicking.

## Verification Commands

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run validate
rg -n "Static answer key|static answer|visible answer key|hidden-answer|Show answer|Hide answer|Quiz: Knowledge check|quiz" README.md SKILL.md docs examples tests src
```

## Cleanup Notes

- This task should not create temporary data.
- If manual demo preview requires copying `examples/component-demo.template.md` to `content/lecture.template.md`, restore the previous `content/lecture.template.md`.
- Do not change production code or tests except for narrow fixture expectation updates caused by demo wording changes.
