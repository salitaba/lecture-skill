# Task: Add Advanced Component Type Contracts

## Goal

Add TypeScript contracts for the ten advanced UI engine components without changing parsing, validation, or rendering behavior yet.

## Dependencies

- None

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts` - Add interfaces, nested item types, `LectureComponentType` literals, and `LectureComponent` union members for the ten new components.

## Checklist

- [x] Add `GlossaryTermComponent` with `term`, `definition`, optional `context`, and optional `aliases`.
- [x] Add `TabsComponent` and `TabPanel` with `title`, at least-two-panel `tabs`, and optional `default_tab`.
- [x] Add `AccordionComponent` and `AccordionItem` with `title`, `items`, and optional `default_open`.
- [x] Add `TimelineComponent` and `TimelineItem` with `title`, `items`, optional `orientation`, and optional item `date`.
- [x] Add `ChecklistComponent` with `title`, string `items`, optional `storage`, and optional `reset_label`.
- [x] Add `FlashcardComponent` with `prompt`, `answer`, optional `hint`, and optional `category`.
- [x] Add `WorkedExampleComponent` with `title`, `problem`, `walkthrough`, `solution`, optional `starter_code`, optional `language`, and optional `takeaway`.
- [x] Add `MistakeCorrectionComponent` with `title`, `mistake`, `why_it_fails`, `correction`, optional `example_before`, and optional `example_after`.
- [x] Add `ResourceLinksComponent` and `ResourceLink` with `title`, `links`, link `label`, link `url`, optional `description`, and optional `category`.
- [x] Add `InstructorNoteComponent` with `title`, `body`, optional `audience`, and optional `timing`.
- [x] Add all ten literal names to `LectureComponentType` and all ten interfaces to `LectureComponent`.
- [x] Do not add author-facing component anchors in this task.

## Expected Behavior

The type model can represent `glossary_term`, `tabs`, `accordion`, `timeline`, `checklist`, `flashcard`, `worked_example`, `mistake_correction`, `resource_links`, and `instructor_note`, but templates using those types may still fail validation until the next task.

## Verification Commands

```bash
npm run typecheck
```

If typecheck fails only because `SectionRenderer` exhaustiveness has not dispatched the new union members yet, defer the full typecheck until `013-advanced-ui-engine-components-04-p1-rendering.md` is complete and record the exact exhaustiveness errors for the implementer.

## Cleanup Notes

- This task should not create temporary data.
- Do not modify validation logic, render components, CSS, examples, docs, or tests in this task.
