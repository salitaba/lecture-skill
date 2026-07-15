# Task 01: Define the Staged Authoring UX in the Canonical Skill

## Goal

Update the canonical Claude lecture-site-engine skill so broad or source-less requests follow a clear intake, scope, research, drafting, and handoff flow. The starter 01-introduction scaffold must not silently determine the course size or final output.

## Dependencies

- Spec: spec/023-improve-skill.txt
- Finalized plan: spec/imp-plan/023-improve-skill-plan.txt
- No earlier implementation task is required.

## Exact Files to Modify

- .claude/skills/lecture-site-engine/SKILL.md

Do not modify distributed entry points, README.md, DEVELOPMENT.md, production code, tests, the spec, the finalized plan, or raw-source files in this task.

## Implementation Details / Checklist

- Add a source-aware intake step that reports active single-lecture/collection mode, relevant template/scaffold paths, raw-source status, and whether real human source evidence exists.
- Treat scaffold placeholders as non-evidence and state that lectures/01-introduction is only a starter, not a course outline or lecture-count decision.
- Classify the request as standalone lecture or course/collection based on wording and scope. For umbrella topics such as DB Internals, require one concise lecture-vs-course clarification when the choice materially changes the output; recommend a collection without creating it silently.
- If the request is clear, state the assumption and proceed without a long questionnaire. Do not infer audience, level, lecture count, or course boundaries from the placeholder.
- Define the source options: use user-provided human raw source by default, or use agent-time internet research only after a direct user authorization. Missing/placeholder source alone does not authorize browsing or fabricated raw input.
- Document the staged flow:
  - authoring brief with mode, scope, assumptions, source strategy, expected files, and next step;
  - bounded research brief with authoritative sources, proposed concepts/sections, and concise source links;
  - outline/scope checkpoint when the choice remains material;
  - generation of the selected standalone template or confirmed numbered collection;
  - validation, source review, doctor, package handoff when requested, and an outcome-oriented final report.
- Require the final report to name created/updated files, lecture count, validation result, human-source/evidence status, warnings, and next action. Do not claim successful completion before validation and artifact paths are known.
- Preserve the no-create/no-edit/no-rewrite/no-delete/no-overwrite rule for all raw-source paths and fixtures, the shared-course-source opt-in rule, the provenance limitation, the supported resource_links-only citation approach, and the examples/golden.template.md restriction.
- Keep the new behavior guidance-only: no interactive CLI, persisted session, runtime URL fetch, new citation schema, or source-ingestion feature.

## Expected Behavior

- A clear standalone request remains one lecture and is not expanded into a course.
- A broad request receives one targeted scope decision or an explicit recommended assumption before generation.
- An explicitly authorized internet-backed request produces a research/outline checkpoint when needed, then generates only the confirmed scope.
- External research is labeled as a derived draft and never becomes human raw-source evidence.

## Verification Commands

    rg -n "authoring brief|standalone|collection|01-introduction|explicit|internet|research|outline|lecture count|source review|doctor|resource_links|raw-source|golden" .claude/skills/lecture-site-engine/SKILL.md

Do not perform network research or modify repository content while verifying this task.

## Cleanup Notes

- Do not read or modify examples/golden.template.md during golden conversion work.
- Do not add research notes, external web content, or generated lecture text to the repository.
- Never create, edit, rewrite, summarize into, replace, delete, or overwrite any raw-source file or fixture.
