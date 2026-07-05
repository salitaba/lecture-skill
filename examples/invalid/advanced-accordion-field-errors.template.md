---
title: "Invalid Accordion"
description: "Invalid accordion component fields."
audience: "Authors"
duration: "10 minutes"
level: "beginner"
---

## Overview

This template has invalid accordion fields.

## Learning Objectives

- Find accordion errors.

## Section: Accordion Problems

```lecture-component
type: accordion
title: "Bad accordion"
default_open: "Missing"
items:
  - title: "Duplicate"
    body: "First."
  - title: "Duplicate"
    body: ""
```

## Key Takeaways

- Accordion items need bodies and valid defaults.
