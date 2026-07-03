---
title: "Component Demo Lecture"
description: "A synthetic valid lecture that demonstrates every supported MVP component."
audience: "Lecture authors"
duration: "20 minutes"
level: "beginner"
---

## Overview

This demo shows how each supported lecture component appears in the rendered page. Use it to inspect the component kit after copying it to the active template path.

## Learning Objectives

- Identify every supported MVP lecture component.
- Apply the exact fenced YAML syntax for supported components.
- Preview component behavior in the local Next.js app.

## Section: Highlighted Notes

Use callouts for ideas that should stand apart from the surrounding explanation.

```lecture-component
type: callout
variant: note
title: "Author note"
body: "A note callout highlights supporting context without interrupting the lesson flow."
```

```lecture-component
type: callout
variant: warning
title: "Common mistake"
body: "A warning callout points to a pitfall the learner should actively avoid."
```

```lecture-component
type: callout
variant: insight
title: "Teaching insight"
body: "An insight callout emphasizes an important conceptual connection."
```

## Section: Concept And Process Components

Concept cards summarize one idea, while step lists show ordered workflows.

```lecture-component
type: concept_card
title: "One concept per card"
body: "Keep concept cards focused on a single term, rule, or mental model."
```

```lecture-component
type: step_list
title: "Preview workflow"
steps:
  - "Copy the demo template to content/lecture.template.md."
  - "Run npm run validate."
  - "Run npm run dev and open the local URL."
```

## Section: Code And Commands

Use code blocks for commands, snippets, or short structured text that benefits from monospace formatting.

```lecture-component
type: code_block
language: "bash"
code: "npm run validate\nnpm run dev"
```

Regular fenced code blocks also render inside the Markdown content.

```text
This is a regular Markdown code fence, not a lecture-component.
```

## Key Takeaways

- The MVP supports callout, concept_card, step_list, and code_block components.
- Components must use fenced YAML with the lecture-component language tag.
- The component demo is valid content but should be restored after previewing.
