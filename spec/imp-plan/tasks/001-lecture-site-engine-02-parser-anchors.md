# 001 Lecture Site Engine - 02 Parser And Anchors

## Goal

Implement the position-preserving lecture template parsing layer and duplicate-section anchor generation described by the finalized plan.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`

## Exact Files To Create Or Modify

- `src/lib/lecture-template/types.ts`
- `src/lib/lecture-template/readTemplate.ts`
- `src/lib/lecture-template/parseTemplate.ts`
- `src/lib/lecture-template/anchors.ts`
- `tests/lecture-template/parseTemplate.test.ts`
- `tests/lecture-template/anchors.test.ts`

## Checklist

- [x] Define shared TypeScript types for:
  - [x] Raw parsed frontmatter plus source locator metadata.
  - [x] Parsed overview, learning objectives, ordered sections, and key takeaways.
  - [x] Section body blocks, regular Markdown blocks, regular fenced code blocks, and `lecture-component` YAML blocks.
  - [x] Parse errors and validation errors with `code`, `message`, `locator`, optional field/heading/section/component context, and optional `hint`.
  - [x] Normalized lecture template returned only after validation passes.
- [x] Implement `readTemplate.ts` so the active template is read from `content/lecture.template.md` relative to the repository root.
- [x] Implement `parseTemplate.ts` with source locator preservation:
  - [x] Pre-scan frontmatter line ranges before YAML parsing.
  - [x] Pre-scan fenced block line ranges, including `lecture-component` fences.
  - [x] Detect unclosed `lecture-component` fences with a blocking parse error and locator.
  - [x] Parse frontmatter and component YAML with an API such as `yaml.parseDocument` that exposes useful diagnostics.
  - [x] Parse or tokenize Markdown headings, lists, tables, paragraphs, and fenced code blocks with line numbers.
  - [x] Preserve content before `## Overview` as `preOverviewContent`.
  - [x] Preserve section context for component blocks inside `## Section: <section title>`.
  - [x] Preserve enough syntax errors for the validator and CLI to print author-locatable messages.
- [x] Implement `anchors.ts` to generate stable unique anchors for duplicate section titles, such as `first-title`, `first-title-2`, and `first-title-3`.
- [x] Avoid helpers that discard locators needed for required error messages.
- [x] Do not silently coerce unsupported headings, aliases, component types, or payload shapes.

## Expected Behavior

- Parsing produces a structured intermediate result even when validation later fails.
- Invalid frontmatter YAML, malformed component YAML, and unclosed `lecture-component` fences include line numbers or precise frontmatter/component context.
- Duplicate section titles produce unique anchors in source order.
- Regular non-component fenced code blocks remain normal Markdown content.

## Verification Commands

```bash
npm run test -- tests/lecture-template/parseTemplate.test.ts tests/lecture-template/anchors.test.ts
npm run test
```

## Cleanup Notes

- Keep parser tests fixture data inline or in committed fixture files only.
- Remove any temporary parser scratch files created while testing locator behavior.
