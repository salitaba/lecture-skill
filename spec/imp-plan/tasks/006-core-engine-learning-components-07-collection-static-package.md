# Task: Collection And Static Package Verification

**Goal**: Prove the new components work in collection validation/rendering and static review packages without adding package-specific component logic.

**Dependencies**: `006-core-engine-learning-components-02-schema-validation-implementation.md`, `006-core-engine-learning-components-04-render-components-styles.md`, `006-core-engine-learning-components-06-examples-docs-skill.md`

## Exact Files To Create Or Modify

- `tests/lecture-template/collection.test.ts` - Add or extend collection validation coverage with a lecture containing new components.
- `tests/lecture-template/validate-collection-cli.test.ts` - Add CLI acceptance/output coverage for collection lectures containing new components if not covered elsewhere.
- `tests/lecture-template/review-package.test.ts` - Modify only if static package behavior needs deterministic coverage.
- `tests/lecture-template/lecture-components.test.tsx` - Add a collection lecture model render assertion only if this is the cleanest existing test location.
- `src/lib/lecture-template/reviewPackage.ts` - Modify only if tests prove package helpers need source-aware changes; the plan expects no component-specific logic here.

## Checklist

- [x] Add collection validation coverage where at least one lecture template contains `comparison`, `summary`, `quote`, and `quiz`.
- [x] Confirm collection validation accepts the new components through the same `validateTemplateSource` path used by single-lecture mode.
- [x] Add collection CLI coverage if current CLI tests do not exercise a collection lecture containing new components.
- [x] Ensure any CLI assertion remains focused on acceptance or useful output, not duplicate component schema coverage.
- [x] Add a render assertion using a validated collection lecture model if no existing render test proves collection-mode rendering.
- [x] Run static package smoke verification with content that includes the new components.
- [x] Confirm static review packages include rendered pages displaying the new components automatically.
- [x] Avoid adding component-specific package source copying or manifest logic unless a failing test proves it is required.

## Expected Behavior

- Collection mode validates and renders lectures containing the new components.
- Collection validation CLI coverage remains green with new component content.
- Static review package generation continues to work through the normal render pipeline.
- `reviewPackage.ts` remains free of component-specific branching unless a verified defect requires otherwise.

## Verification Commands

```bash
npm run test -- tests/lecture-template/collection.test.ts
npm run test -- tests/lecture-template/validate-collection-cli.test.ts
npm run test -- tests/lecture-template/review-package.test.ts
npm run package:review
npm run build
```

## Cleanup Notes

- Any collection tests that create repository state must use `mkdtempSync(os.tmpdir())`.
- Restore `process.cwd()` in `afterEach`.
- Remove temporary directories with `rmSync(tempRoot, { recursive: true, force: true })`.
- Remove local-only smoke packages under `review-packages/` after manual/static package verification if they are not needed for handoff.
- Do not leave active root `lectures/` or `content/` changes from smoke verification.
