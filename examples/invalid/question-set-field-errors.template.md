---
title: "Question Set Field Errors"
description: "Invalid question set fields."
audience: "Lecture authors"
duration: "10 minutes"
level: "beginner"
---

## Overview

Overview paragraph.

## Learning Objectives

- See question set field validation.

## Section: Question Set Problems

```lecture-component
type: question_set
title: ""
shuffle_options: sometimes
questions:
  - question: ""
    mode: multiple_answer
    options:
      - "Valid option"
      - ""
    answer: "Missing option"
    feedback: ""
  - "not a mapping"
  - question: "Duplicate options?"
    options:
      - "Same"
      - "Same"
    answer: "Same"
```

## Key Takeaways

- Invalid question sets report nested field paths.
