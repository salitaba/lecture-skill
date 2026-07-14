---
name: lecture-site-engine
description: Converts raw lecture source into a validated Lecture Site Engine template or collection.
---

# Lecture Site Engine Skill

Use the canonical project skill at `SKILL.md` in the repository root. Read it completely before acting, then follow its instructions for:

- converting user-supplied raw lecture source into `content/lecture.template.md` or a `lectures/` collection;
- preserving raw source evidence and source uncertainty;
- never creating, editing, rewriting, summarizing into, replacing, deleting, or overwriting `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, or raw-source fixtures;
- using per-lecture source as the default context and reading `lectures/raw-course.txt` only for an explicitly requested shared-source workflow; scaffold placeholders are not evidence and must be replaced;
- using only supported component types and payload shapes;
- running validation until it passes;
- creating source-fidelity worksheets, diagnostics, previews, and static review packages when requested.

The Claude Code discovery path contains the same skill at `.claude/skills/lecture-site-engine/SKILL.md`. Keep both agent entry points aligned when the skill changes.

The workflow can preserve and classify files, but it cannot cryptographically determine whether user-supplied source text was AI-generated.
