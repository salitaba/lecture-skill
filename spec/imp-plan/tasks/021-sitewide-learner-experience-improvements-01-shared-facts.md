# Task 01: Add Shared Facts and Course-Description Primitives

## Goal

Create the shared presentation primitives and collection/lecture integrations that make learner-facing facts semantic, concise, and predictable at every viewport. Keep the full authored course description available in static HTML without requiring client hydration.

## Dependencies

- Spec: `spec/021-sitewide-learner-experience-improvements.txt`
- Plan: `spec/imp-plan/021-sitewide-learner-experience-improvements-plan.txt`
- No earlier implementation task is required. Preserve the existing `CourseMetadata`, `LectureMetadata`, and `CollectionValidationResult` contracts.

## Exact Files to Create or Modify

- **Create**: `src/components/component-kit/FactsList.tsx`
- **Create**: `src/components/lecture-kit/CourseDescription.tsx`
- **Modify**: `src/components/component-kit/index.ts`
- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Modify**: `src/components/lecture-kit/LectureHeader.tsx`
- **Modify**: `src/components/lecture-kit/LectureList.tsx`
- **Modify**: `src/app/globals.css`
- **Modify**: `tests/lecture-template/collection-cta.test.tsx`
- **Modify**: `tests/lecture-template/lecture-list-state.test.tsx`
- **Modify**: `tests/lecture-template/lecture-components.test.tsx`

## Checklist

- [x] Add a typed `FactsList` component accepting already-filtered `{ label, value }` entries, `variant: "default" | "compact"`, an accessible label, and an optional class name.
- [x] Render each fact as a semantic `dl` containing one wrapper `div` per `dt`/`dd` pair; omit empty entries rather than emitting blank labels or values.
- [x] Export `FactsList` through `src/components/component-kit/index.ts` without changing existing component-kit APIs.
- [x] Add server-rendered `CourseDescription`; keep short descriptions as a paragraph and use native `<details>`/`<summary>` for long descriptions with a sentence/word-boundary preview and the complete original string in the details body.
- [x] Keep `CourseDescription` free of client-only state so the full text is present in static output and before hydration.
- [x] Replace the collection summary sentence with labelled essential facts for lecture count, aggregate estimated study time (derived from lecture metadata durations), and reading time when nonzero. Remove the learner-facing validation/pass count.
- [x] Move optional course audience, level, and authored duration to secondary course detail; do not present authored aggregate duration and computed study time as competing unlabeled primary totals.
- [x] Render the course description through `CourseDescription` and preserve the existing primary start/resume/continue action and “View all lectures” link.
- [x] Update `LectureHeader` to use `FactsList`, label metadata duration as “Estimated study time,” retain section count/audience/level, and show “Reading time” only when available.
- [x] Pass valid optional course metadata into `LectureList`; always show lecture duration and section count, and suppress audience/level only when their normalized trimmed values match the course values.
- [x] Add facts-list responsive CSS that resets browser `dl`/`dd` defaults, aligns labels and values from one left edge, uses explicit wide-screen columns, and becomes controlled two-column/single-column layouts at narrower widths.
- [x] Add/adjust tests for labelled collection facts, removal of “passing,” native long-description reachability, semantic `dl` markup, duration labels, and course-matching versus differing lecture metadata.

## Expected Behavior

- A collection’s first viewport communicates what the course is, how many lectures it contains, its estimated study time, optional reading time, and one primary start/resume action without reviewer validation wording.
- Long descriptions have a concise visible preview and an accessible “About this course” disclosure whose full text is present in the rendered/static markup.
- Lecture and course facts are left-aligned and scan as rows/columns at desktop, tablet, and 390px widths; no user-agent `dd` indentation or jagged centered values remain.
- Matching course audience/level values are not repeated on every lecture card, while differing values and cards without course metadata remain informative.

## Verification Command(s)

```bash
npm test -- tests/lecture-template/collection-cta.test.tsx tests/lecture-template/lecture-list-state.test.tsx tests/lecture-template/lecture-components.test.tsx
npm run typecheck
```

## Cleanup Notes

- No storage, fixture, or external-data cleanup is required.
- Do not change YAML/template schemas, validation result shapes, progress keys, or persisted data.
- Keep the collection validation details available for later reviewer-status work; this task only removes them from the primary learner summary.
