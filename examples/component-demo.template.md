---
title: "Component Demo Lecture"
description: "A synthetic valid lecture that demonstrates every supported component."
audience: "Lecture authors"
duration: "20 minutes"
level: "beginner"
---

## Overview

This visual gallery shows how each supported lecture component appears in the rendered page. It is synthetic review content, not a production lecture.

## Learning Objectives

- Identify every supported lecture component by its rendered role label.
- Apply the exact fenced YAML syntax for supported components.
- Preview wrapping, quiz answer reveal behavior, and internal code scrolling in the local Next.js app.

## Section: Highlight Components

Use highlight components for ideas that should stand apart from surrounding explanation without becoming a separate lesson section.

```lecture-component
type: callout
variant: note
title: "Author note"
body: "A note callout highlights supporting context without interrupting the lesson flow."
```

```lecture-component
type: callout
variant: warning
title: "Common mistake"
body: "A warning callout points to a pitfall the learner should actively avoid."
```

```lecture-component
type: callout
variant: insight
title: "Teaching insight"
body: "An insight callout emphasizes an important conceptual connection."
```

## Section: Concept And Process Components

Concept cards summarize one idea, while Step-by-step components show ordered workflows.

```lecture-component
type: concept_card
title: "One concept per card"
body: "Keep concept cards focused on a single term, rule, or mental model."
```

```lecture-component
type: step_list
title: "Preview workflow"
steps:
  - "Copy the demo template to content/lecture.template.md."
  - "Run npm run validate."
  - "Run npm run dev and open the local URL, then inspect the rendered Step-by-step list at phone, tablet, and desktop widths."
```

## Section: Structure Components

Use code blocks for commands, snippets, or short structured text that benefits from monospace formatting.

```lecture-component
type: code_block
language: "bash"
code: "npm run validate\nnpm run dev\nnode scripts/check-overflow.js --template=content/lecture.template.md --viewport=390 --assert=no-page-overflow"
```

Regular fenced code blocks also render inside the Markdown content.

```text
This is a regular Markdown code fence, not a lecture-component.
```

## Section: Evidence And Recap Components

Use evidence and recap components to compare ideas, recap a local section, and ground a point in a short source quote.

```lecture-component
type: comparison
title: "Local Preview vs Static Review Package"
left_label: "Local preview workflow"
right_label: "Static review package workflow"
items:
  - label: "Purpose and audience for the review surface"
    left: "Inspect the lecture while authoring, including local navigation, component labels, and validation feedback before sharing."
    right: "Hand off a portable static artifact so reviewers can inspect the same component UX without running a development server."
  - label: "Command and expected feedback loop"
    left: "npm run dev, then refresh the local page after changing authored Markdown or component YAML."
    right: "npm run package:review, then open the generated package and verify the static HTML keeps comparison, quote, quiz, and code behavior intact."
  - label: "Long-content wrapping case for dense comparison rows"
    left: "A deliberately long local-preview description should wrap inside the left value cell instead of widening the page or hiding text."
    right: "A deliberately long static-package description should wrap inside the right value cell while preserving the relationship to this row label."
```

```lecture-component
type: summary
title: "What this section adds"
items:
  - "Comparison components make two-sided tradeoffs easier to scan."
  - "Summary components recap a local idea before moving on."
```

```lecture-component
type: quote
quote: "Use components only when they clarify the lesson, make a teaching role visible, or preserve a source-grounded statement that would lose meaning as ordinary prose."
attribution: "Synthetic authoring guidance for component review"
context: "Source quote components are for short excerpts or named statements; this intentionally longer synthetic quote checks wrapping and keeps attribution attached."
```

## Section: Check Understanding Components

Use Quiz components for lightweight knowledge checks with feedback revealed on demand. Use stronger assessment components for grouped checks, written reasoning, and applied practice.

```lecture-component
type: quiz
question: "Quiz: Which command validates the active lecture or collection before previewing the component gallery at narrow, tablet, and desktop viewport widths?"
options:
  - "npm run validate"
  - "npm run dev"
  - "npm run package:review"
  - "Run the browser only and assume validation is equivalent to visual inspection."
answer: "npm run validate"
explanation: "Validation checks the active template or collection and exits nonzero on blocking errors; the rendered quiz reveals this feedback only when the learner clicks Show answer."
```

```lecture-component
type: question_set
title: "Component Review Questions"
instructions: "Choose an answer for each item before revealing feedback."
shuffle_options: true
questions:
  - question: "Which component groups several related single-answer checks?"
    options:
      - "question_set"
      - "free_response"
      - "practice_task"
    answer: "question_set"
    feedback: "Use question_set when several recall or comprehension prompts belong together."
  - question: "What does preview-only option shuffling preserve for review?"
    options:
      - "Authored order in static output and print."
      - "A hidden answer bank."
      - "Saved learner progress."
    answer: "Authored order in static output and print."
    feedback: "Shuffle is only a learner-preview pacing aid; source, print, and review packages keep authored order."
```

```lecture-component
type: free_response
title: "Explain Reveal Pacing"
prompt: "Why should a learner draft an answer before comparing it with guidance?"
placeholder: "Write two or three sentences about retrieval practice."
guidance: "A drafted answer makes the learner commit to reasoning before seeing model guidance, which makes comparison more useful."
```

```lecture-component
type: practice_task
title: "Repair An Invalid Assessment"
scenario: "A generated lecture contains a question_set whose answer does not match any authored option."
task: "Use validation feedback to locate the bad field and revise the YAML without changing the intended teaching point."
steps:
  - "Run npm run validate."
  - "Find the INVALID_COMPONENT_FIELD entry and field path."
  - "Edit the answer or option text so they match exactly after trimming."
hints:
  - "Start with the field path that includes questions[index].answer."
starter_code:
  language: "yaml"
  code: "type: question_set\nquestions:\n  - question: \"Which command validates?\"\n    options:\n      - \"npm run validate\"\n      - \"npm run dev\"\n    answer: \"validate\""
solution: "Set answer to the exact option text, such as npm run validate, or update one option to the intended exact answer."
rubric:
  - criterion: "Schema correctness"
    expected: "The assessment validates without INVALID_COMPONENT_FIELD errors."
  - criterion: "Teaching value"
    expected: "The corrected answer still checks the intended concept."
```

## Section: Diagram Components

Use Diagram components to render Mermaid.js diagrams inline within lecture sections. Diagrams are useful for architecture overviews, process flows, sequence interactions, state machines, data models, and timelines.

```lecture-component
type: diagram
diagram_type: flowchart
title: "Data flow from source to render"
code: "graph LR\n  A[Author] -->|writes| B[Markdown]\n  B -->|parsed| C[Template]\n  C -->|rendered| D[HTML]"
direction: LR
```

```lecture-component
type: diagram
diagram_type: sequence
title: "Client-server request lifecycle"
code: "sequenceDiagram\n  participant C as Client\n  participant S as Server\n  C->>S: GET /lecture\n  S-->>C: 200 OK + HTML"
```

```lecture-component
type: diagram
diagram_type: class
title: "Component class hierarchy"
code: "classDiagram\n  class LectureComponent {\n    +type\n    +title\n  }\n  class Callout {\n    +variant\n    +body\n  }\n  LectureComponent <|-- Callout"
```

```lecture-component
type: diagram
diagram_type: state
title: "Validation state machine"
code: "stateDiagram-v2\n  [*] --> Pending\n  Pending --> Validating\n  Validating --> Valid\n  Validating --> Invalid"
```

```lecture-component
type: diagram
diagram_type: er
title: "Lecture data model"
code: "erDiagram\n  LECTURE ||--o{ SECTION : contains\n  SECTION ||--o{ COMPONENT : has\n  LECTURE {\n    string title\n    string level\n  }"
```

```lecture-component
type: diagram
diagram_type: gantt
title: "Project timeline"
code: "gantt\n  title Implementation Plan\n  section Phase 1\n    Types :a1, 2024-01-01, 3d\n    Validation :a2, after a1, 2d\n  section Phase 2\n    Components :b1, after a2, 4d"
```

```lecture-component
type: diagram
diagram_type: pie
title: "Component usage distribution"
code: "pie\n  title Component Usage\n  \"Callout\" : 30\n  \"Code Block\" : 25\n  \"Quiz\" : 20\n  \"Other\" : 25"
```

```lecture-component
type: diagram
diagram_type: mindmap
title: "Lecture skill architecture"
code: "mindmap\n  root((Lecture Skill))\n    Parser\n      YAML\n      Markdown\n    Components\n      Callout\n      Quiz\n      Diagram\n    Renderer\n      Static\n      Interactive"
```

## Key Takeaways

- The engine supports callout, concept_card, step_list, code_block, comparison, summary, quote, quiz, question_set, free_response, practice_task, and diagram components.
- Components must use fenced YAML with the lecture-component language tag.
- Quiz is a knowledge check whose answer and explanation are revealed on demand; stronger assessment components support grouped checks, local written responses, and applied practice.
- Diagram renders Mermaid.js diagrams with a static fallback for no-JS environments.
- The component demo is valid visual-gallery content but should be restored after previewing.
