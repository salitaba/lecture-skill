# Development Guide

This document is for maintainers and contributors working on the Lecture Site Engine repository. End users should start with [`README.md`](README.md) and the agent authoring instructions in [`SKILL.md`](SKILL.md).

## Local setup

Use Node.js 24 LTS and its bundled npm:

```bash
npm ci
```

The repository contains the Next.js application, the lecture parser/validator, the CLI package, agent skills, fixtures, specifications, and review artifacts.

## Verification

Run the focused checks relevant to a change, or the complete release check:

```bash
npm run lint
npm run typecheck
npm test
npm run validate
npm run build
npm run build:cli
npm run release:check
```

`release:check` runs lint, typecheck, the full test suite, the production build, the CLI build, and `npm pack --dry-run`.

Generated directories are ignored and should not be committed:

- `.next/`
- `.lecture-site-engine/`
- `dist/`
- `out/`
- `review-packages/`
- `coverage/`

## Architecture

- `src/app/`: Next.js routes and application shell.
- `src/components/component-kit/`: generic UI primitives.
- `src/components/lecture-kit/`: lecture-domain components composed from the primitives.
- `src/lib/lecture-template/`: parsing, validation, rendering models, scaffolding, source review, and package assembly.
- `src/cli/`: the published `lecture-site-engine` command.
- `scripts/`: repository-local TypeScript command wrappers.
- `tests/lecture-template/`: parser, validator, renderer, CLI, and interaction tests.
- `spec/`: product specifications and implementation plans.

New lecture components belong in `lecture-kit` and should compose existing `component-kit` primitives. Styling is centralized in `src/app/globals.css` and follows the existing semantic tokens and surface-altitude system.

## Agent skill distribution

The lecture authoring workflow is exposed through three repository entry points:

- `.claude/skills/lecture-site-engine/SKILL.md` for Claude Code.
- `.codex/skills/lecture-site-engine/SKILL.md` for Codex.
- `SKILL.md` as a root fallback for other agents.

The published npm package includes these entry points plus the repository's auxiliary `.codex/skills/` assets. `npx lecture-site-engine init` copies only the Lecture Site Engine entry points into a consumer project, preserves existing consumer-owned files, and creates the default collection scaffold. The implementation lives in `src/cli/commands/init.ts`; its behavior is covered by `tests/lecture-template/init.test.ts`.

The repository's auxiliary Codex skills are `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, and `ui-ux-pro-max`. They remain available for repository development and packaging, but `init` does not copy them into consumer projects. Their instructions may reference optional external companion skills or tools.

Keep the skill aligned with the validator and README. Do not expose golden-answer content in agent-accessible instructions.

### Agent authoring UX boundary

The staged authoring flow is guidance-only. It starts with source-status intake, distinguishes a clear standalone lecture from a confirmed collection, and treats `lectures/01-introduction/` as a starter scaffold rather than a course plan. Broad or materially ambiguous requests get one targeted lecture-vs-course decision or a stated recommended assumption; the agent must not silently reduce a broad topic to the starter lecture.

Human raw source remains the default evidence path. Direct user authorization is required before agent-time internet research. That research is bounded, summarized as a brief and proposed outline with concise `resource_links`, and labeled as a derived draft. It never creates or changes raw-source files and never promotes external research to present human evidence. Per-lecture sources remain the default context; `lectures/raw-course.txt` is optional shared human evidence and its presence alone is not authorization to load it.

This UX does not add session state, an interactive CLI, runtime URL fetching, a citation or bibliography schema, a source-ingestion service, a route, learner progress behavior, or readiness semantics. It reuses the existing collection scaffold, validation, `review:source`, `doctor`, and `package:review` commands. A handoff reports created/updated files, lecture count, validation result, human-source/evidence status, warnings, and the next action. Source-review worksheets and doctor output continue to use `present`, `missing`, and `placeholder`; file handling cannot cryptographically determine whether supplied text was AI-generated.

## Documentation and review workflows

Source-fidelity review is human review evidence, not semantic fact-checking. Raw-source classification is centralized in `src/lib/lecture-template/rawSourceEvidence.ts` and returns `present`, `missing`, or `placeholder`. Primary evidence is the raw file next to a lecture; `lectures/raw-course.txt` is optional shared evidence. Missing and placeholder primary files keep source-fidelity readiness not ready, while missing or placeholder shared evidence is optional. Placeholders are never copied into review packages; present evidence is copied only from canonical paths.

Use:

```bash
npm run review:source
npm run doctor
npm run package:review
```

The golden conversion record is maintained in [`docs/golden-conversion-batch.md`](docs/golden-conversion-batch.md). Generation workspaces must not expose `examples/golden.template.md` until generation and validation are complete.

The raw-source contract is intentionally limited to safe file handling and explicit guidance. There is no schema, route, progress, or AI-generation API change, and the system cannot verify whether user-supplied source text was AI-generated. Keep review output labels aligned with `Primary human source evidence`, `Optional shared human source evidence`, `Generated lecture template`, and `Scaffold placeholder; replace with human source`.

## npm release

The package is configured as `lecture-site-engine`. Before a release:

```bash
npm run release:check
npm pack --dry-run
```

Publishing is automated by [`.github/workflows/release.yml`](.github/workflows/release.yml). It runs only for pushed semver tags matching `v*.*.*`, derives the npm version from the tag, and publishes with provenance.

Configure the repository secret `NPM_TOKEN`, then push a tag:

```bash
git tag v0.2.0
git push origin v0.2.0
```

The tag `v0.2.0` publishes version `0.2.0` even when the repository's development version is different.

## GitHub Actions

The CI workflow runs on pull requests targeting `main` and manual dispatches. It does not run on pushes to `main`. It validates lecture content and runs the release checks.

The release workflow requires:

- a pushed tag matching `v*.*.*`;
- an npm token stored as `NPM_TOKEN`;
- npm permission to publish `lecture-site-engine`.

## Project plans

Product requirements live in `spec/`. Repository-specific implementation plans and task files live under `spec/imp-plan/`. These are maintainer artifacts and should not be part of the end-user onboarding path.
