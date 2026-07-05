---
title: "Opening The Collection"
description: "Introduces the multi-lecture workflow and the idea of authored order."
audience: "Technical educators"
duration: "25 minutes"
level: "beginner"
---

## Overview

This opening lecture explains how to orient a small course, keep the sequence visible, and make the first pass easy to review.

## Learning Objectives

- Explain why authored order matters in a local lecture collection.
- Recognize the files that define a lecture route.
- Preview how a learner moves from the landing page into the first lecture.

## Section: Collection Shape

A course collection stays predictable when each lecture lives in its own numbered directory.

```lecture-component
type: callout
variant: note
title: "Directory rhythm"
body: "Numbered folders keep the authored order obvious for both people and automation."
```

```lecture-component
type: glossary_term
term: "Collection mode"
definition: "A lecture-site workflow where numbered lecture folders render as one ordered course."
context: "The landing page and per-lecture routes are derived from the collection directory."
```

```lecture-component
type: timeline
title: "Collection Preview Path"
items:
  - label: "Scan"
    detail: "Find numbered lecture folders."
  - label: "Validate"
    detail: "Validate each lecture template in authored order."
  - label: "Render"
    detail: "Expose the landing page and each lecture route."
```

## Section: First Preview

Open the first lecture, confirm the content reads on its own, and then move on to the next route.

```lecture-component
type: step_list
title: "Preview flow"
steps:
  - "Open the landing page."
  - "Follow the first lecture link."
  - "Check that the navigation footer points forward."
```

```lecture-component
type: checklist
title: "Preview Checks"
items:
  - "Landing page lists the first lecture."
  - "The first lecture route renders independently."
  - "The footer points to the next lecture."
```

```lecture-component
type: flashcard
prompt: "Where does collection order come from?"
answer: "From the numbered lecture directories and course metadata."
```

```lecture-component
type: resource_links
title: "Collection Files"
links:
  - label: "Course metadata"
    url: "../course.yaml"
    description: "Optional collection label and summary data."
  - label: "Next lecture"
    url: "../02-core-concepts/lecture.template.md"
    description: "The next authored lecture template."
```

## Key Takeaways

- Numbered lecture directories give the collection a stable order.
- The landing page should make the next step obvious.
- Each lecture still needs the standard template sections.
