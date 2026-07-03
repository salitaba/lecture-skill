# 001 Lecture Site Engine - 03 P0 Validator

## Goal

Implement the P0 validation contract so structurally parseable templates aggregate all detectable blocking errors and valid templates produce a normalized render model.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts`
- `src/lib/lecture-template/validateTemplate.ts`
- `tests/lecture-template/validateTemplate.test.ts`

## Checklist

- [x] Implement a validation result shape with:
  - [x] `valid: boolean`
  - [x] `template` only when validation passes
  - [x] `errors` containing author-locatable validation errors
- [x] Validate required frontmatter fields:
  - [x] `title`
  - [x] `description`
  - [x] `audience`
  - [x] `duration`
  - [x] `level`
- [x] Treat required frontmatter strings as invalid when missing or empty after trimming.
- [x] Allow unknown extra frontmatter fields and ignore them in the normalized render model.
- [x] Validate `level` is exactly `beginner`, `intermediate`, or `advanced`, and include allowed values in the error.
- [x] Validate required heading order:
  - [x] `## Overview`
  - [x] `## Learning Objectives`
  - [x] one or more `## Section: <section title>`
  - [x] `## Key Takeaways`
- [x] Detect missing required sections by name.
- [x] Detect out-of-order required headings.
- [x] Detect duplicate singleton headings for `Overview`, `Learning Objectives`, and `Key Takeaways`.
- [x] Reject non-empty body content before `## Overview`.
- [x] Require `Overview` to contain at least one non-empty paragraph.
- [x] Require `Learning Objectives` and `Key Takeaways` to contain at least one Markdown bullet item.
- [x] Reject empty section titles.
- [x] Reject sections with no meaningful content block.
- [x] Treat non-empty paragraph, Markdown bullet list, numbered list, regular fenced code block, Markdown table, or supported lecture component as meaningful section content.
- [x] Reject `lecture-component` blocks outside sections.
- [x] Reject unsupported component types, including deferred types such as `comparison`, `summary`, `quote`, and `quiz`.
- [x] Validate exact supported component payloads:
  - [x] `callout` requires `type`, `variant`, `title`, and `body`.
  - [x] `callout.variant` is `note`, `warning`, or `insight`.
  - [x] `concept_card` requires `type`, `title`, and `body`.
  - [x] `step_list` requires `type`, `title`, and non-empty string-list `steps`.
  - [x] `code_block` requires `type`, `language`, and `code`.
- [x] Include section context for invalid content inside sections.
- [x] Include component type and invalid or missing field names for invalid component payloads.
- [x] Convert parser syntax errors into blocking validation errors with the best available locator.
- [x] Aggregate all detectable P0 errors from one parse pass when the template is structurally parseable.
- [x] Allow a single high-quality blocking syntax error when severe YAML or fence breakage prevents reliable later parsing.

## Expected Behavior

- Valid parsed templates return a normalized template model usable by the renderer.
- Invalid templates never return a renderable template.
- Validation errors identify the field, heading, section, component type, locator, and mechanical hint when available.
- Unsupported aliases, heading names, component types, and payload shapes are not accepted.

## Verification Commands

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test
```

## Cleanup Notes

- Do not add broad fallback coercion to make tests pass.
- Keep test fixtures committed if they are part of reusable P0 validation coverage.
