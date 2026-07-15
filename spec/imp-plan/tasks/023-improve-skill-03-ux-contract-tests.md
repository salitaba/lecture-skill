# Task 03: Add Deterministic Authoring-UX Contract Tests

## Goal

Lock the staged authoring UX, scope-selection behavior, research authorization, progress reporting, and raw-source protection into deterministic repository tests.

## Dependencies

- Tasks 01–02: all guidance entry points contain the finalized policy.
- Spec: spec/023-improve-skill.txt
- Finalized plan: spec/imp-plan/023-improve-skill-plan.txt

## Exact Files to Modify

- tests/lecture-template/agent-guidance.test.ts

Inspect but modify only if a concrete regression gap is exposed:

- tests/lecture-template/init.test.ts
- tests/lecture-template/scaffold.test.ts
- tests/lecture-template/source-review.test.ts
- tests/lecture-template/doctor.test.ts
- tests/lecture-template/review-package.test.ts

Do not modify production code, raw-source fixtures, the spec, or the finalized plan.

## Implementation Details / Checklist

- Continue reading the five guidance files: the canonical Claude skill, root SKILL.md, Codex entry point, AGENTS.md, and CLAUDE.md.
- Keep existing assertions for raw-source mutation prohibition, lectures/raw-course.txt opt-in context, placeholder non-evidence, and provenance limitation.
- Add stable policy assertions for source-status intake, standalone-vs-collection scope selection, the rule that 01-introduction is only a starter, and one targeted clarification/recommended assumption for materially broad requests.
- Add assertions for explicit internet-research authorization, research brief/outline/source-link checkpoint, derived-draft labeling, and final artifact/lecture-count/validation/evidence/next-action reporting.
- Use targeted regular expressions or focused phrases rather than full-file snapshots. Do not test a particular wording beyond the contract needed for UX.
- Keep tests offline and deterministic. Do not call search engines, fetch URLs, simulate an LLM, evaluate source quality, or test AI authorship.
- Preserve existing init/scaffold/source-review/doctor/package behavior. If an assertion is needed, use temporary directories and verify no shared raw-course placeholder is auto-created and no authored raw file is overwritten.

## Expected Behavior

- Guidance drift fails focused tests when the agent loses the staged authoring flow or silently reverts to one-scaffold-lecture behavior.
- Tests prove the new flow is documentation-level and does not promote external research to present human evidence.
- Tests remain isolated from network access and repository raw fixtures.

## Verification Commands

    npm test -- tests/lecture-template/agent-guidance.test.ts
    npm test -- tests/lecture-template/init.test.ts tests/lecture-template/scaffold.test.ts tests/lecture-template/source-review.test.ts tests/lecture-template/doctor.test.ts tests/lecture-template/review-package.test.ts
    npm run typecheck

## Cleanup Notes

- Use temporary directories for filesystem tests, restore process.cwd() in afterEach, and remove all temporary roots.
- Do not add external web content, AI-generated source fixtures, or changes under examples/.
