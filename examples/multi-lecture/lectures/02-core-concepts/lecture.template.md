---
title: "Core Concepts For The Collection"
description: "Shows how the second lecture deepens the course without changing the template."
audience: "Technical educators"
duration: "30 minutes"
level: "intermediate"
---

## Overview

This lecture builds on the first one by reinforcing navigation, validation, and review habits.

## Learning Objectives

- Describe how collection validation treats each lecture independently.
- Identify the per-lecture route pattern.
- Explain the back-to-course link.

## Section: Validation Signals

A collection can contain both passing and failing lectures without blocking the rest of the course.

```lecture-component
type: concept_card
title: "Independent validation"
body: "One lecture can fail validation while the landing page and other passing lectures remain available."
```

## Section: Course Navigation

Learners should be able to move forward, backward, and back to the course outline without losing context.

```lecture-component
type: callout
variant: insight
title: "Navigation stays local"
body: "The footer links are just plain anchors, so the course remains fast and easy to inspect."
```

## Key Takeaways

- Collection validation reports each lecture separately.
- Per-lecture navigation should be predictable and keyboard friendly.
- The landing page is the stable entry point for the course.
