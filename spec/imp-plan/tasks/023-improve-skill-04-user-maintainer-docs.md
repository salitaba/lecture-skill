# Task 04: Document the Staged Authoring Flow

## Goal

Explain the improved authoring conversation to users and maintainers while keeping the engine’s existing schema, source-review, and runtime boundaries explicit.

## Dependencies

- Tasks 01–03: canonical policy and contract-test expectations are established.
- Spec: spec/023-improve-skill.txt
- Finalized plan: spec/imp-plan/023-improve-skill-plan.txt

## Exact Files to Modify

- README.md
- DEVELOPMENT.md

Do not modify production code, tests, skill entry points, raw-source fixtures, examples/golden.template.md, the spec, or the finalized plan in this task.

## Implementation Details / Checklist

- Update README.md with a concise flow: inspect source status, choose standalone lecture or collection, authorize research only when needed, review the brief/outline, generate, validate, and hand off.
- Explain that 01-introduction created by init is only a starter scaffold. It does not mean a broad topic should become exactly one lecture.
- Explain that clear standalone requests remain standalone, while broad topics should receive one targeted lecture-vs-course decision with a recommended collection option where appropriate.
- Explain the external-research branch: explicit user authorization, bounded authoritative research, source links through resource_links, derived-draft labeling, and the remaining human-source review limitation.
- Preserve the shared-source semantics: lectures/raw-course.txt is optional shared human evidence, per-lecture sources are default context, and presence alone is not authorization.
- Update DEVELOPMENT.md to document that this is agent-time guidance only, with no new session state, interactive CLI, runtime fetch, citation schema, source-ingestion service, route, progress, or readiness change.
- Keep terminology aligned with present/missing/placeholder, primary/shared evidence, source-review worksheets, doctor output, and review packages.
- Add a short preferred response-shape example for a broad internet-backed request, without adding external web content or hardcoding a DB Internals curriculum.

## Expected Behavior

- Users understand why the agent may ask one scope question and what it will do before writing files.
- Maintainers understand that the UX improvement reuses existing collection and verification commands and does not alter product behavior.
- Documentation does not claim that external research satisfies human source fidelity or that the engine fetches/fact-checks URLs.

## Verification Commands

    rg -n "authoring|standalone|collection|01-introduction|research|outline|resource_links|raw-course.txt|placeholder|runtime|fetch|source fidelity|AI-generated" README.md DEVELOPMENT.md
    npm test -- tests/lecture-template/agent-guidance.test.ts

## Cleanup Notes

- Do not paste external web content into documentation or fixtures.
- Do not create or alter raw-source files, generated review evidence, or package output.
