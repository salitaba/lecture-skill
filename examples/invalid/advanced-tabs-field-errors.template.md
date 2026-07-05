---
title: "Invalid Tabs"
description: "Invalid tabs component fields."
audience: "Authors"
duration: "10 minutes"
level: "beginner"
---

## Overview

This template has invalid tabs fields.

## Learning Objectives

- Find tabs errors.

## Section: Tabs Problems

```lecture-component
type: tabs
title: "Bad tabs"
default_tab: "Missing"
tabs:
  - label: "Same"
    content: "First."
  - label: "Same"
    content: ""
```

## Key Takeaways

- Tabs need unique labels and valid defaults.
