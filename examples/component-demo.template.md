---
title: "Component Demo Lecture"
description: "A synthetic valid lecture that demonstrates every supported component."
audience: "Lecture authors"
duration: "20 minutes"
level: "beginner"
---

## Overview

This visual gallery shows how each supported lecture component appears in the rendered page. It is synthetic review content, not a production lecture.

## Learning Objectives

- Identify every supported lecture component by its rendered role label.
- Apply the exact fenced YAML syntax for supported components.
- Preview wrapping, static answer-key behavior, and internal code scrolling in the local Next.js app.

## Section: Highlight Components

Use highlight components for ideas that should stand apart from surrounding explanation without becoming a separate lesson section.

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

Concept cards summarize one idea, while Step-by-step components show ordered workflows.

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
  - "Run npm run dev and open the local URL, then inspect the rendered Step-by-step list at phone, tablet, and desktop widths."
```

## Section: Structure Components

Use code blocks for commands, snippets, or short structured text that benefits from monospace formatting.

```lecture-component
type: code_block
language: "bash"
code: "npm run validate\nnpm run dev\nnode scripts/check-overflow.js --template=content/lecture.template.md --viewport=390 --assert=no-page-overflow"
```

Regular fenced code blocks also render inside the Markdown content.

```text
This is a regular Markdown code fence, not a lecture-component.
```

## Section: Evidence And Recap Components

Use evidence and recap components to compare ideas, recap a local section, and ground a point in a short source quote.

```lecture-component
type: comparison
title: "Local Preview vs Static Review Package"
left_label: "Local preview workflow"
right_label: "Static review package workflow"
items:
  - label: "Purpose and audience for the review surface"
    left: "Inspect the lecture while authoring, including local navigation, component labels, and validation feedback before sharing."
    right: "Hand off a portable static artifact so reviewers can inspect the same component UX without running a development server."
  - label: "Command and expected feedback loop"
    left: "npm run dev, then refresh the local page after changing authored Markdown or component YAML."
    right: "npm run package:review, then open the generated package and verify the static HTML keeps comparison, quote, quiz, and code behavior intact."
  - label: "Long-content wrapping case for dense comparison rows"
    left: "A deliberately long local-preview description should wrap inside the left value cell instead of widening the page or hiding text."
    right: "A deliberately long static-package description should wrap inside the right value cell while preserving the relationship to this row label."
```

```lecture-component
type: summary
title: "What this section adds"
items:
  - "Comparison components make two-sided tradeoffs easier to scan."
  - "Summary components recap a local idea before moving on."
```

```lecture-component
type: quote
quote: "Use components only when they clarify the lesson, make a teaching role visible, or preserve a source-grounded statement that would lose meaning as ordinary prose."
attribution: "Synthetic authoring guidance for component review"
context: "Source quote components are for short excerpts or named statements; this intentionally longer synthetic quote checks wrapping and keeps attribution attached."
```

## Section: Check Understanding Components

Use Quiz components for static teaching checks with a visible answer key, not hidden answers or scoring.

```lecture-component
type: quiz
question: "Quiz: Which command validates the active lecture or collection before previewing the component gallery at narrow, tablet, and desktop viewport widths?"
options:
  - "npm run validate"
  - "npm run dev"
  - "npm run package:review"
  - "Run the browser only and assume validation is equivalent to visual inspection."
answer: "npm run validate"
explanation: "Validation checks the active template or collection and exits nonzero on blocking errors; the rendered quiz then shows this static answer key intentionally as teaching feedback."
```

## Key Takeaways

- The engine supports callout, concept_card, step_list, code_block, comparison, summary, quote, and quiz components.
- Components must use fenced YAML with the lecture-component language tag.
- Quiz is a static teaching check with a visible answer key.
- The component demo is valid visual-gallery content but should be restored after previewing.
