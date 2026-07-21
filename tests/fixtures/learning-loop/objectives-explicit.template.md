---
title: "Explicit Objectives"
description: "A fixture for stable learning objective IDs."
audience: "Learners"
duration: "10 minutes"
level: "beginner"
---

## Overview

This fixture gives each objective a source-grounded stable identifier.

## Learning Objectives

- [build-timeline] Build a timeline from the supplied events.
- [explain-tradeoffs] Explain the tradeoffs in the chosen ordering.

## Section: Build The Timeline

Use the timeline model to organize the events before reviewing the checks.

```lecture-component
type: quiz
id: timeline-check
anchor: timeline-check
objective_refs:
  - build-timeline
question: "Which action comes first?"
options:
  - "Order the events"
  - "Skip the events"
answer: "Order the events"
```

## Key Takeaways

- Stable objective IDs let assessments point back to authored outcomes.
