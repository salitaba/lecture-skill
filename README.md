# Lecture Site Engine

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
.codex/skills/lecture-site-engine/SKILL.md
SKILL.md
```

Replace the placeholder with human/user/educator course material, then ask your coding agent to follow the `lecture-site-engine` skill and create the lecture. The agent should preserve that source and write the generated lesson to `lecture.template.md`. Raw-source files are never agent-generated output.

Validate and preview:

```bash
npx lecture-site-engine validate
npx lecture-site-engine dev
```

Open [http://localhost:3000](http://localhost:3000).

## Use the skill

Claude Code discovers:

```text
.claude/skills/lecture-site-engine/SKILL.md
```

Codex discovers:

```text
.codex/skills/lecture-site-engine/SKILL.md
```

Other agents can follow the root [`SKILL.md`](SKILL.md). The skill explains the supported frontmatter, section structure, teaching components, source-fidelity rules, validation loop, and review workflow.

After initialization, a useful prompt is:

```text
Read and follow the lecture-site-engine skill. Use the raw lecture source in lectures/01-introduction/raw-lecture.txt, create or update the matching lecture.template.md, preserve source-grounded meaning, and run npx lecture-site-engine validate until it passes.
```

## Authoring workflow

1. Supply human raw source evidence next to each lecture template.
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

## Learn more

- [`SKILL.md`](SKILL.md): complete instructions for AI-assisted lecture authoring.
- [`DEVELOPMENT.md`](DEVELOPMENT.md): repository development, testing, packaging, and release guidance.
- [`docs/mvp-review-checklist.md`](docs/mvp-review-checklist.md): reviewer quality checklist.
- [`examples/multi-lecture/`](examples/multi-lecture/): example collection.
