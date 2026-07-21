---
title: "Assessment Coverage"
description: "A fixture for objective-to-assessment coverage diagnostics."
audience: "Authors"
duration: "15 minutes"
level: "intermediate"
---

## Overview

This fixture includes linked, unlinked, legacy, and unresolved objective cases.

## Learning Objectives

- [linked-outcome] Explain the linked outcome.
- [unlinked-outcome] Explain the outcome without an assessment.
- A legacy outcome remains visible but is not referenceable.

## Section: Coverage Checks

The linked quiz covers one explicit objective, while this second assessment has an unresolved reference that should block validation.

```lecture-component
type: quiz
id: linked-check
anchor: linked-check
objective_refs:
  - linked-outcome
question: "Which outcome is linked?"
options:
  - "linked-outcome"
  - "unlinked-outcome"
answer: "linked-outcome"
```

```lecture-component
type: free_response
id: unresolved-check
anchor: unresolved-check
objective_refs:
  - missing-outcome
title: "Explain the missing reference"
prompt: "Explain why this reference is unresolved."
```

## Key Takeaways

- Coverage diagnostics distinguish linked and unlinked authored objectives.
