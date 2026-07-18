# Lecture Site Engine plugin

This skills-only plugin makes the Lecture Site Engine authoring workflow
available in ChatGPT desktop and Codex.

It can turn human-provided lecture source into validated lecture templates or
confirmed multi-lecture collections, then run the project validation and review
workflow. It does not provide a hosted app or remote MCP tools.

## Install from GitHub

After this repository is pushed to GitHub, users can add its marketplace:

```bash
codex plugin marketplace add salitaba/lecture-skill
```

Then install `lecture-site-engine` from the **Lecture Site Engine** marketplace
in the ChatGPT desktop app, or with:

```bash
codex plugin add lecture-site-engine@lecture-site-engine
```

Start a new chat after installation and ask ChatGPT or Codex to follow the
`lecture-site-engine` skill.
