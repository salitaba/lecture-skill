# Lecture Site Engine project instructions

This repository is both the Lecture Site Engine application and its reusable agent skill.

## Lecture authoring

For lecture-authoring or course-authoring work, read `SKILL.md` completely before editing content. The Claude Code discovery path is `.claude/skills/lecture-site-engine/SKILL.md`; the Codex discovery path is `.codex/skills/lecture-site-engine/SKILL.md`.

Authoring UX boundary:

- Inspect source status before drafting and distinguish human evidence from missing or scaffold-placeholder files.
- A clear standalone request remains one lecture. A broad topic must not be silently reduced to `lectures/01-introduction/`; that starter scaffold is not a course plan. Ask one targeted standalone-vs-collection question when the choice materially changes output, or state a recommended assumption when scope is clear enough. Use `content/lecture.template.md` for standalone output and numbered `lectures/<slug>/lecture.template.md` paths for a confirmed collection.
- Human raw source is the default. Agent-time internet research requires direct user authorization, a bounded research brief/outline, a scope checkpoint when material, and concise `resource_links`; it creates a derived draft and never present human evidence. Missing or placeholder source alone does not authorize browsing. It does not add runtime URL fetching, a bibliography schema, or source ingestion.
- Finish by reporting created/updated files, lecture count, validation, human-source/evidence status, warnings, and the next action. Use existing validation, source review, doctor, and review-package commands.
- For a server request, run `npm run dev` here or `npx lecture-site-engine dev` in a consumer project, verify the reported local URL with an HTTP request, and return the exact working URL. Do not bypass the CLI by launching Next from an npm cache; `.lecture-site-engine/` is disposable generated runtime state.

Preserve raw source files as evidence. Do not read `examples/golden.template.md` during the golden conversion workflow. Use only the supported template schema and component types, then run:

```bash
npm run validate
```

Use `npm run validate -- --json` when machine-readable diagnostics are useful. Before review handoff, run `npm run review:source`, `npm run doctor`, and, when requested, `npm run package:review`.

Raw-source ownership contract:

- `content/raw-lecture.txt`, `lectures/<slug>/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source fixtures under `examples/` are human/user/educator evidence.
- Agents must never create, edit, rewrite, summarize into, replace, delete, or overwrite raw-source files. Ask for missing source material instead of fabricating or AI-generating lecture input.
- Per-lecture source is the default context. Read `lectures/raw-course.txt` only for an explicitly requested shared-source split, cross-lecture reconciliation, or full-course review; presence alone is not authorization.
- Scaffold placeholders are not evidence and must be replaced before authoring or source-fidelity approval. The system can preserve and classify files but cannot cryptographically determine whether supplied text was AI-generated.

## Project verification

Use Node.js 24 LTS and its bundled npm. The normal checks are:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run build:cli
```

The CLI package is exercised from a consumer project with `npx lecture-site-engine <command>`.
