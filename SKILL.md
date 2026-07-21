---
name: lecture-site-engine
description: Converts raw lecture source into a validated Lecture Site Engine template or collection.
---

# Lecture Site Engine Skill

This repository's canonical lecture-authoring skill is maintained at:

`.claude/skills/lecture-site-engine/SKILL.md`

Read that file completely before converting lecture source, creating lecture templates, or preparing review packages. It contains the full schema, supported component contracts, source-fidelity rules, collection workflow, validation loop, and handoff guidance.

The same skill is available to Codex at:

`.codex/skills/lecture-site-engine/SKILL.md`

For each authoring request, inspect source status first, including whether a raw file is present, missing, or a scaffold placeholder. Resolve the requested scope as either one standalone lecture or a confirmed collection; a clear standalone request stays one lecture, while a broad topic should receive one targeted scope question or an explicit recommended assumption and must not be silently reduced to the starter lecture. `lectures/01-introduction/` is only a starter scaffold, not a course plan. Use `content/lecture.template.md` for standalone output and numbered `lectures/<slug>/lecture.template.md` paths for a confirmed collection.

Use human source by default. Internet research is an agent-time option only after direct user authorization. When authorized, provide a bounded research brief with an outline and scope checkpoint plus concise source links before drafting when scope is material, label the result as a derived draft that never becomes present human evidence, and use existing `resource_links` rather than inventing a citation schema. Runtime URL fetching is not part of the engine.

Finish with an outcome-oriented handoff naming created or updated files, lecture count, validation result, human-source/evidence status, warnings, and the next action. Read the canonical skill for the complete staged authoring flow.

For a server request, use `npm run dev` in this repository or `npx lecture-site-engine dev` in a consumer project. Verify that the reported local URL responds before saying the preview is ready. If it fails, report the first actionable CLI/runtime error and do not bypass the CLI with a direct Next command from an npm cache.

When working inside this repository, use the local `npm run` commands documented by the skill. When using the released CLI from another project, use the equivalent `npx lecture-site-engine <command>` form.

Raw source files are human/user/educator evidence, not generated output. Agents must never create, edit, rewrite, summarize into, replace, delete, or overwrite `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, or raw-source fixtures. Use the requested lecture's per-lecture source by default; read the optional shared course source only for an explicitly requested shared-source workflow. Scaffold placeholders are non-evidence and must be replaced before authoring approval. The system cannot cryptographically verify whether supplied text was AI-generated.

When the source supports stable outcomes, authors may add explicit objective IDs such as `- [build-timeline] Build an incident timeline.` and reference them from assessments with `objective_refs`. Never fabricate objectives or references to make coverage look complete. Legacy unmarked objectives remain valid but their generated IDs are display-only and not referenceable. Learner evidence and local review scheduling are browser-only, non-grading signals and never become source evidence or package data.
