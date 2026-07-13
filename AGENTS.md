# Lecture Site Engine project instructions

This repository is both the Lecture Site Engine application and its reusable agent skill.

## Lecture authoring

For lecture-authoring or course-authoring work, read `SKILL.md` completely before editing content. The Claude Code discovery path is `.claude/skills/lecture-site-engine/SKILL.md`; the Codex discovery path is `.codex/skills/lecture-site-engine/SKILL.md`.

Preserve raw source files as evidence. Do not read `examples/golden.template.md` during the golden conversion workflow. Use only the supported template schema and component types, then run:

```bash
npm run validate
```

Use `npm run validate -- --json` when machine-readable diagnostics are useful. Before review handoff, run `npm run review:source`, `npm run doctor`, and, when requested, `npm run package:review`.

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
