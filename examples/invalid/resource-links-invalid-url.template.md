---
title: "Invalid Resource Links"
description: "Invalid resource links component fields."
audience: "Authors"
duration: "10 minutes"
level: "beginner"
---

## Overview

This template has invalid resource link URLs.

## Learning Objectives

- Find resource link errors.

## Section: Resource Problems

```lecture-component
type: resource_links
title: "Bad resources"
links:
  - label: ""
    url: "javascript:alert(1)"
  - label: "Protocol relative"
    url: "//example.com/file"
  - label: "Malformed"
    url: "https://"
```

## Key Takeaways

- Resource links need safe URL values.
