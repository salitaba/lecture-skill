---
title: "Quiz Field Errors"
description: "Exercises invalid quiz component fields."
audience: "Engineers"
duration: "20 minutes"
level: "beginner"
---

## Overview

This overview is present.

## Learning Objectives

- Explain quiz validation.

## Section: Quiz Problems

```lecture-component
type: quiz
question: "Too few options"
options:
  - "Only one"
answer: "Only one"
```

```lecture-component
type: quiz
question: "Malformed option"
options:
  - ""
  - 42
answer: "Missing option"
explanation: ""
```

```lecture-component
type: quiz
question: "Wrong answer"
options:
  - "First"
  - "Second"
answer: "Missing option"
```

```lecture-component
type: quiz
question: "Missing answer"
options:
  - "First"
  - "Second"
```

## Key Takeaways

- Invalid quiz components should fail validation.
