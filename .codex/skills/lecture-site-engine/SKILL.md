---
name: lecture-site-engine
description: Converts raw lecture source into a validated Lecture Site Engine template or collection.
---

# Lecture Site Engine Skill

Use the canonical project skill at `SKILL.md` in the repository root. Read it completely before acting, then follow its instructions for:

- converting user-supplied raw lecture source into `content/lecture.template.md` or a `lectures/` collection;
- starting with a source-aware intake, keeping a clear standalone request as one lecture, resolving standalone-lecture versus collection scope with one targeted scope question or a recommended assumption when needed, and treating `lectures/01-introduction/` as a starter scaffold rather than a course plan; a broad request must not be silently reduced to that starter lecture;
- writing the mode-appropriate artifact: `content/lecture.template.md` for standalone work or numbered `lectures/<slug>/lecture.template.md` paths for a confirmed collection;
- using an authoring brief, an explicitly authorized bounded research brief, outline, and scope checkpoint when needed, then reporting staged progress and the confirmed output;
- preserving raw source evidence and source uncertainty;
- never creating, editing, rewriting, summarizing into, replacing, deleting, or overwriting `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, or raw-source fixtures;
- using per-lecture source as the default context and reading `lectures/raw-course.txt` only for an explicitly requested shared-source workflow; scaffold placeholders are not evidence and must be replaced;
- using only supported component types and payload shapes;
- running validation until it passes;
- creating source-fidelity worksheets, diagnostics, previews, and static review packages when requested.

User-provided human source is the default. Missing or placeholder source does not authorize browsing; agent-time internet research requires direct user authorization and produces a derived draft only, never present human evidence. Use existing `resource_links` for concise references; this workflow does not add runtime URL fetching, a bibliography schema, or source-ingestion behavior. A final handoff names created or updated files, lecture count, validation result, human-source/evidence status, warnings, and the next action.

The Claude Code discovery path contains the same skill at `.claude/skills/lecture-site-engine/SKILL.md`. Keep both agent entry points aligned when the skill changes.

The workflow can preserve and classify files, but it cannot cryptographically determine whether user-supplied source text was AI-generated.
