---
title: "First Lecture"
description: "The first collection fixture."
audience: "Learners"
duration: "10 minutes"
level: "beginner"
---

## Overview

The first lecture uses a shared objective ID in its own lecture namespace.

## Learning Objectives

- [shared-outcome] Explain the first lecture context.

## Section: First Context

First lecture content.

```lecture-component
type: quiz
id: first-check
anchor: first-check
objective_refs:
  - shared-outcome
question: "Which lecture is this?"
options:
  - "First"
  - "Second"
answer: "First"
```

## Key Takeaways

- The first lecture keeps its own objective evidence.
