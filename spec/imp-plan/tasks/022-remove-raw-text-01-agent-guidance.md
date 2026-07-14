# Task 01: Establish the Human-Authored Raw-Source Policy

## Objective

Align every agent-facing entry point with the finalized raw-source contract: raw files are human/user/educator evidence, agents never generate or mutate them, and `lectures/raw-course.txt` is opt-in additional context rather than automatic agent context.

## Dependencies

- Spec: `spec/022-remove-raw-text.txt`
- Plan: `spec/imp-plan/022-remove-raw-text-plan.txt`
- No earlier implementation task is required.

## Exact Files to Modify

- `.claude/skills/lecture-site-engine/SKILL.md`
- `.codex/skills/lecture-site-engine/SKILL.md`
- `SKILL.md`
- `AGENTS.md`
- `CLAUDE.md`

Do not modify `README.md` or `DEVELOPMENT.md` in this task; those user/maintainer explanations belong to Task 07.

## Implementation Details

- In the canonical Claude skill, state that `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source fixtures under `examples/` are source evidence supplied by the user, educator, or an existing course source.
- Explicitly prohibit an agent from creating, editing, rewriting, summarizing into, replacing, deleting, or overwriting any raw-source file. Missing source must result in a request for source material, never fabricated or AI-generated lecture input.
- State that agents may generate derived artifacts such as `lecture.template.md`, worksheets, diagnostics, and review packages, but may not author raw evidence. Preserve the existing instruction not to inspect `examples/golden.template.md` during the golden conversion workflow.
- Make per-lecture raw source the default context for the requested lecture(s). Require an explicit user request to read `lectures/raw-course.txt` for splitting a shared course source, reconciling cross-lecture context, or a full-course review; the shared file’s presence alone is not authorization to load it into agent context.
- Keep the root `SKILL.md` summary and Codex entry point aligned with the canonical skill instead of duplicating the full schema. The Codex file must continue to direct agents to the canonical/root instructions.
- Update `AGENTS.md` and `CLAUDE.md` with concise repository rules covering raw-source preservation, the opt-in shared-source exception, and the provenance limitation: file handling can be enforced, but the system cannot cryptographically determine whether user-supplied text was AI-generated.
- Keep guidance compatible with both single-lecture and collection paths and do not introduce an AI call, source generator, summarizer, or provenance field.

## Acceptance Criteria

- All five guidance files consistently prohibit raw-source mutation and distinguish generated templates from source evidence.
- The default/opt-in context rule is explicit and names `lectures/raw-course.txt`.
- The guidance says placeholders are not authored source evidence and must be replaced before authoring/review approval, without claiming provenance can be technically verified.
- No component schema, command behavior, or raw-source path is removed.

## Verification / Tests

```bash
rg -n "raw-course.txt|raw-lecture.txt|never|do not|opt-in|explicit|AI-generated|placeholder|provenance" \
  SKILL.md .claude/skills/lecture-site-engine/SKILL.md \
  .codex/skills/lecture-site-engine/SKILL.md AGENTS.md CLAUDE.md
```

Task 06 adds deterministic contract tests for the exact policy and distributed skill files.

## Cleanup Notes

- Do not read or modify `examples/golden.template.md` as part of this task.
- Do not modify raw-source fixtures or any user-authored raw file.
