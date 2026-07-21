# Lecture Site Engine

[![skills.sh](https://skills.sh/b/salitaba/lecture-skill)](https://skills.sh/salitaba/lecture-skill)

Turn raw lecture notes into a local, visual lecture collection with help from Claude Code, Codex, or another coding agent.

The engine provides the lecture template format, accessible teaching components, validation, local preview, learner progress, and reviewer handoff packages. The included skill tells an agent how to turn source material into that format without inventing unsupported content.

## Quick start

Requirements:

- Node.js 24 LTS
- npm bundled with Node.js 24 LTS

In the project where you want to author lectures, run:

```bash
npx lecture-site-engine@latest init
```

This creates a starter collection and installs the agent skill files. The generated per-lecture raw file is a visibly marked scaffold placeholder, not source evidence:

```text
lectures/
  course.yaml
  01-introduction/
    lecture.template.md
    raw-lecture.txt
.claude/skills/lecture-site-engine/SKILL.md
.codex/skills/
  lecture-site-engine/
SKILL.md
```

`init` installs only the Lecture Site Engine entry points: the root `SKILL.md`, the Claude Code skill, and the Codex `lecture-site-engine` skill. Existing consumer-owned skill files are preserved. Auxiliary skills bundled in the repository are not added to a consumer project by `init`.

Replace the placeholder with human/user/educator course material, then ask your coding agent to follow the `lecture-site-engine` skill and create the lecture. The agent should preserve that source and write the generated lesson to `lecture.template.md`. Raw-source files are never agent-generated output. The `01-introduction` directory is only a starter scaffold; it is not a course outline or a decision to create exactly one lecture.

Validate and preview:

```bash
npx lecture-site-engine validate
npx lecture-site-engine dev
```

The CLI stages its runtime app under `.lecture-site-engine/` and chooses a compatibility-safe Next launch path, so this command is the complete preview workflow. Open the ready URL printed by the command, normally [http://localhost:3000](http://localhost:3000). If the port is already in use, Next may choose another port; use the URL it reports.

## Use the skill

Install the authoring skill from skills.sh:

```bash
npx skills add salitaba/lecture-skill --skill lecture-site-engine
```

Claude Code discovers:

```text
.claude/skills/lecture-site-engine/SKILL.md
```

Codex discovers:

```text
.codex/skills/lecture-site-engine/SKILL.md
```

The repository may contain additional independently discoverable Codex skills for development, but `init` does not install them:

- `banner-design`
- `brand`
- `design`
- `design-system`
- `slides`
- `ui-styling`
- `ui-ux-pro-max`

## Install as a ChatGPT/Codex plugin

This repository also contains a skills-only plugin at
[`plugins/lecture-site-engine`](plugins/lecture-site-engine). It packages the
lecture-authoring workflow for sharing through a GitHub-backed marketplace.

After cloning or publishing this repository, add its marketplace:

```bash
codex plugin marketplace add salitaba/lecture-skill
```

Then install `lecture-site-engine` from the **Lecture Site Engine** marketplace
in the ChatGPT desktop app, or run:

```bash
codex plugin add lecture-site-engine@lecture-site-engine
```

This is a skills-only plugin. It provides authoring guidance and local CLI
workflows; it does not expose the Next.js site as a hosted ChatGPT app or
remote MCP service. For public visibility in the official ChatGPT Plugins
Directory, submit the skills bundle through the OpenAI Platform after pushing
the repository.

Other agents can follow the root [`SKILL.md`](SKILL.md). The lecture skill explains the supported frontmatter, section structure, teaching components, source-fidelity rules, validation loop, and review workflow.

After initialization, a useful prompt is:

```text
Read and follow the lecture-site-engine skill. Use the raw lecture source in lectures/01-introduction/raw-lecture.txt, create or update the matching lecture.template.md, preserve source-grounded meaning, and run npx lecture-site-engine validate until it passes.
```

## Authoring workflow

The agent begins by inspecting source status and reporting whether relevant raw files are present, missing, or scaffold placeholders. It then keeps a clear standalone request as one lecture. For a broad topic, it asks one targeted lecture-vs-course question, recommending a collection when the subject is naturally course-sized, or states a clear assumption when the scope is already decided. The starter scaffold never silently determines the course size.

Human raw source is the default. If it is unavailable, internet research is allowed only after direct user authorization. The agent should provide a bounded research brief with a proposed outline and concise source links before drafting when scope is material. Links belong in the existing `resource_links` component; research-backed output is a derived draft and does not become human source evidence. The engine does not fetch URLs at runtime or add a bibliography schema.

The staged flow is: authoring brief → (authorized) research brief → scope checkpoint → selected lecture or confirmed collection → validation and handoff. The final report should identify created/updated files, lecture count, validation result, human-source/evidence status, warnings, and the next command or decision.

A preferred response shape for a broad, internet-backed request is:

```text
Authoring brief: [mode, scope, assumptions, source status, expected paths]
Research brief: [bounded concepts, proposed outline, concise source links]
Scope checkpoint: [one recommended lecture-vs-course decision]
Draft and verification: [created files, lecture count, validation/source-review status]
Handoff: [warnings, human-source limitation, next action]
```

After the scope is clear, use:

1. Supply human raw source evidence next to each lecture template when available.
2. Ask Claude Code, Codex, or another agent to follow `SKILL.md`.
3. Run `npx lecture-site-engine validate`.
4. Preview with `npx lecture-site-engine dev`.
5. Add more lectures with `npx lecture-site-engine new:lecture`.
6. Create a reviewer worksheet with `npx lecture-site-engine review:source`.
7. Create a portable handoff package with `npx lecture-site-engine package:review` when review is requested.

The initializer and scaffold commands never overwrite existing authored templates or raw source files. Scaffold placeholders do not count as evidence and must be replaced before authoring or source-fidelity approval.

## Collection structure

```text
lectures/
  course.yaml                 # optional course metadata
  raw-course.txt              # optional shared human source evidence
  01-introduction/
    raw-lecture.txt
    lecture.template.md
  02-core-concepts/
    raw-lecture.txt
    lecture.template.md
```

The collection landing page links to each lecture, provides previous/next navigation, and tracks browser-local learner progress. `course.yaml` can define the title, description, audience, level, and duration.

### Unified interaction and assessment engine

The five assessment components (`quiz`, `question_set`, `free_response`, `practice_task`, and `flashcard`) share one internal registry and capability model. Every assessment can optionally declare a stable lowercase `id` and syntax-validated `objective_refs` metadata. Registry IDs are deterministic and do not replace existing page anchors, so authored links remain stable.

The runtime provides a common accessible shell, feedback/status announcements, keyboard-friendly reveal controls, and useful static/print fallbacks. Choice attempts for quizzes and question sets may persist locally and are revalidated against the current authored options; written-response, rubric, and flashcard lifecycle state remains local to the mounted activity. The collection and lecture indexes expose all five types, while answer review and answer-key exports remain limited to objective choice activities.

Validation JSON and static review-package records include deterministic assessment summaries by type and evaluation mode, objective references, answer-key coverage, and an explicit `learnerStateIncluded: false` marker. They never include answer text or learner attempts.

`lectures/raw-course.txt` is optional evidence for a real course source spanning multiple lectures. Review tooling reads it when present, but an agent loads it into context only for an explicitly requested shared-source split, cross-lecture reconciliation, or full-course review; its presence alone is not authorization. Per-lecture sources are the default context. Do not paste generated lecture output into any raw-source file. The system can preserve and classify files but cannot cryptographically determine whether user-supplied text was AI-generated.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npx lecture-site-engine init` | Install skills and create a starter collection |
| `npx lecture-site-engine new:lecture` | Create the next lecture scaffold |
| `npx lecture-site-engine validate` | Validate templates and metadata |
| `npx lecture-site-engine doctor` | Check project readiness |
| `npx lecture-site-engine dev` | Start the local preview |
| `npx lecture-site-engine review:source` | Create a source-fidelity worksheet |
| `npx lecture-site-engine package:review` | Build a static reviewer handoff |

When working inside a cloned Lecture Site Engine repository, the same commands are available as `npm run ...` scripts.

### Release from a laptop

The repository includes a guarded release command that publishes directly to npm from your laptop. It checks npm authentication, runs the complete release check, bumps the version, publishes the package, and creates a local release commit and tag.

Authenticate once:

```bash
npm login --registry=https://registry.npmjs.org
```

Preview a release without changing files or git history:

```bash
npm run release -- patch --dry-run
```

Release the next patch, minor, or major version:

```bash
npm run release -- patch
npm run release -- minor
npm run release -- major
```

An exact version is also accepted, for example `npm run release -- 0.1.3`.

After a local release, push the commit if desired:

```bash
git push origin main
```

Do not push the generated `v*.*.*` tag, because the tag-based GitHub workflow also publishes to npm. Use `--ci` only when you want the previous tag-driven GitHub release instead:

```bash
npm run release -- patch --ci
```

## Learn more

- [`SKILL.md`](SKILL.md): complete instructions for AI-assisted lecture authoring.
- [`DEVELOPMENT.md`](DEVELOPMENT.md): repository development, testing, packaging, and release guidance.
- [`docs/mvp-review-checklist.md`](docs/mvp-review-checklist.md): reviewer quality checklist.
- [`examples/multi-lecture/`](examples/multi-lecture/): example collection.
