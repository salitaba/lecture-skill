# Task 05: Verify Both Authoring UX Branches and Compatibility

## Goal

Verify the complete staged flow and prove that the UX improvement does not weaken raw-source ownership or alter engine/runtime contracts.

## Dependencies

- Tasks 01–04 must be complete.
- This is the final verification boundary; do not introduce new product decisions while executing it.

## Exact Files to Create or Modify

- No repository production, test, plan, spec, documentation, or raw-source files should be modified by this task.
- Use only disposable temporary workspace files for manual verification.

## Implementation Details / Checklist

- Run focused guidance, init, scaffold, source-review, doctor, and review-package tests.
- Run npm run validate, npm run typecheck, npm run lint, npm test, npm run build, and npm run build:cli.
- In a temporary consumer workspace, exercise a clear standalone request and confirm the documented flow does not expand it into a multi-lecture course.
- In a temporary placeholder-only workspace, exercise a broad topic with explicit internet-research authorization. Confirm the agent presents source status, recommends standalone vs collection, provides a research outline/source basis and expected files, and generates only after the agreed scope is clear.
- Confirm the final report identifies created/updated files, lecture count, validation result, human-source/evidence status, warnings, and next action.
- Confirm the authorized research branch does not create or alter raw-lecture files, create lectures/raw-course.txt automatically, promote external content to present human evidence, or introduce runtime URL fetching or new schema fields.
- Confirm review:source, doctor, and package:review continue to report missing/placeholder human evidence using existing semantics.
- Inspect final status and verify this implementation-plan turn changed only the revised plan and the five 023 task files, apart from unrelated pre-existing worktree changes.

## Expected Behavior

- Clear standalone requests remain one lecture.
- Broad requests receive a deliberate scope decision and do not silently stop at the first scaffold lecture.
- Explicit internet research produces a scoped, cited derived draft or collection with transparent evidence limitations.
- Existing validation, source-review, doctor, packaging, routes, progress, and raw-source contracts remain unchanged.

## Verification Commands

    npm test -- tests/lecture-template/agent-guidance.test.ts tests/lecture-template/init.test.ts tests/lecture-template/scaffold.test.ts
    npm test -- tests/lecture-template/source-review.test.ts tests/lecture-template/doctor.test.ts tests/lecture-template/review-package.test.ts
    npm run validate
    npm run typecheck
    npm run lint
    npm test
    npm run build
    npm run build:cli

Optional disposable consumer commands:

    npx lecture-site-engine init
    npx lecture-site-engine validate
    npx lecture-site-engine review:source
    npx lecture-site-engine doctor
    npx lecture-site-engine package:review

## Cleanup Notes

- Remove only temporary consumer workspaces, temporary package/build staging, and other disposable outputs created by verification.
- Do not remove repository review artifacts or user-authored raw sources.
- Do not modify examples/golden.template.md during golden conversion work.
