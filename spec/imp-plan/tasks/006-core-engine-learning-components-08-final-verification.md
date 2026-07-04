# Task: Final Verification

**Goal**: Run the complete quality gate and manual responsive checks for the new learning components before handoff.

**Dependencies**: `006-core-engine-learning-components-01-validation-contract-tests.md`, `006-core-engine-learning-components-02-schema-validation-implementation.md`, `006-core-engine-learning-components-03-invalid-fixtures-cli.md`, `006-core-engine-learning-components-04-render-components-styles.md`, `006-core-engine-learning-components-05-rendering-tests.md`, `006-core-engine-learning-components-06-examples-docs-skill.md`, `006-core-engine-learning-components-07-collection-static-package.md`

## Exact Files To Create Or Modify

- No production, test, example, or documentation files required unless verification exposes a defect.
- Relevant files from earlier tasks - Modify only to fix verified defects.

## Checklist

- [x] Run focused validation and CLI tests:

```bash
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/validate-cli.test.ts
npm run test -- tests/lecture-template/fixtures.test.ts
```

- [x] Run focused collection and rendering tests:

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

- [x] Run broad automated quality gates:

```bash
npm run validate
npm run test
npm run typecheck
npm run lint
npm run build
```

- [x] Run static review package smoke verification:

```bash
npm run package:review
```

- [x] Start the local preview server:

```bash
npm run dev
```

- [x] Preview a template containing all supported components.
- [x] Check 390px, 768px, and 1280px viewport widths.
- [x] Confirm there is no body-level horizontal overflow:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

- [x] Confirm comparison labels and values wrap without clipping.
- [x] Confirm long quote text wraps without clipping or overlap.
- [x] Confirm long quiz options wrap without clipping or overlap.
- [x] Confirm the quiz answer/explanation area is clearly labeled and static.
- [x] Confirm keyboard navigation and visible focus states still behave as before.
- [x] Run the stale-language search and verify current docs/examples do not still claim these four component types are unsupported:

```bash
rg -n "comparison|summary|quote|quiz|MVP|deferred|unsupported component type" README.md SKILL.md docs examples
```

## Expected Behavior

- All focused and broad automated checks pass.
- The component demo validates and renders every supported component.
- Single-lecture and collection workflows remain unchanged except for supporting the new component vocabulary.
- Static review packages display the new components without component-specific package logic.
- No component creates body-level horizontal overflow at 390px, 768px, or 1280px.

## Verification Commands

```bash
npm run validate
npm run test
npm run typecheck
npm run lint
npm run build
npm run package:review
```

Manual verification:

```bash
npm run dev
```

## Cleanup Notes

- Stop the dev server before finishing.
- Restore any temporarily modified active template or collection used for manual smoke checks.
- Remove generated review packages, `.next-review/`, `out/`, or staging directories created during smoke verification if they are not needed for handoff.
- Do not remove unrelated local files or revert edits made by others.
