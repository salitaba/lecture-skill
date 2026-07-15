# Task 02: Align Distributed and Repository Agent Guidance

## Goal

Propagate the canonical staged authoring UX and provenance boundaries to every repository-discoverable agent entry point without duplicating the full schema.

## Dependencies

- Task 01: canonical skill wording and workflow are finalized.
- Spec: spec/023-improve-skill.txt
- Finalized plan: spec/imp-plan/023-improve-skill-plan.txt

## Exact Files to Modify

- .codex/skills/lecture-site-engine/SKILL.md
- SKILL.md
- AGENTS.md
- CLAUDE.md

Do not modify the canonical skill, README.md, DEVELOPMENT.md, production code, tests, the spec, the finalized plan, or raw-source files in this task.

## Implementation Details / Checklist

- Keep the Codex entry point pointed at the canonical instructions while summarizing the new intake: inspect source status, resolve standalone-vs-course scope, obtain explicit research authorization, and report staged progress/results.
- Update the root fallback summary with the same source-first versus explicitly researched-derived-draft distinction.
- Add concise repository rules to AGENTS.md and CLAUDE.md stating that a broad topic must not be silently reduced to the starter lecture, a starter scaffold is not a course plan, and scope should be clarified or stated as an assumption.
- Preserve the existing raw-source ownership contract, placeholder non-evidence rule, optional/shared raw-course context rule, and inability to verify AI authorship cryptographically.
- Make all four files say that external research is agent-time only, uses existing resource_links, and does not imply runtime URL fetching, a bibliography schema, or a source-fidelity pass.
- Keep repository-only AGENTS.md and CLAUDE.md out of init distribution; only distributed skill entry points are copied by init.

## Expected Behavior

- All five guidance surfaces describe the same authoring UX and provenance boundaries.
- Codex and generic agents can understand the scope checkpoint without reading an implementation-specific prompt.
- No guidance claims that the existing 01-introduction scaffold defines the final course structure.

## Verification Commands

    rg -n "authoring brief|standalone|collection|01-introduction|explicit|internet|research|outline|resource_links|raw-course.txt|placeholder|AI-generated|runtime" SKILL.md .codex/skills/lecture-site-engine/SKILL.md AGENTS.md CLAUDE.md

Run the guidance contract test after Task 03. Do not perform network research.

## Cleanup Notes

- Do not modify examples/golden.template.md or any raw-source file.
- Preserve unrelated user worktree changes.
