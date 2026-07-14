# Claude Code project instructions

This is the Lecture Site Engine repository. For lecture or course authoring, use the project skill at `.claude/skills/lecture-site-engine/SKILL.md`; read it completely before editing templates or content. The root `SKILL.md` and Codex skill path are compatibility entry points for the same workflow.

Keep raw lecture sources intact, use the documented schema, validate with `npm run validate`, and run the focused verification relevant to any code change. Do not inspect `examples/golden.template.md` during the golden conversion workflow.

Raw-source files are human/user/educator evidence: `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source fixtures under `examples/`. Never create, edit, rewrite, summarize into, replace, delete, or overwrite them; ask the user for missing source material. Use per-lecture source by default. Read `lectures/raw-course.txt` only for an explicitly requested shared-source split, cross-lecture reconciliation, or full-course review. Its presence alone is not authorization. Scaffold placeholders are non-evidence and must be replaced before authoring or source-fidelity approval. File preservation/classification cannot cryptographically verify whether supplied text was AI-generated.
