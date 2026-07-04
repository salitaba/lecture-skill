# Task: Final Verification

## Goal

Run all checks to confirm the diagram feature is complete, correct, and does not break existing functionality.

## Dependencies

- `010-interactive-diagrams-flowcharts-01-dependency.md`
- `010-interactive-diagrams-flowcharts-02-types.md`
- `010-interactive-diagrams-flowcharts-03-validation.md`
- `010-interactive-diagrams-flowcharts-04-diagram-component.md`
- `010-interactive-diagrams-flowcharts-05-section-renderer.md`
- `010-interactive-diagrams-flowcharts-06-styles.md`
- `010-interactive-diagrams-flowcharts-07-docs-examples.md`
- `010-interactive-diagrams-flowcharts-08-tests.md`

## Exact Files To Create Or Modify

- No new production or test files should be necessary for this task.
- Modify only files needed to fix failures found by the verification commands.
- Read these files when preparing the final handoff:
  - `spec/010-interactive-diagrams-flowcharts.txt`
  - `spec/imp-plan/010-interactive-diagrams-flowcharts-plan.txt`
  - `src/lib/lecture-template/types.ts`
  - `src/lib/lecture-template/validateTemplate.ts`
  - `src/components/lecture-kit/Diagram.tsx`
  - `src/components/lecture-kit/SectionRenderer.tsx`
  - `src/app/globals.css`
  - `tests/lecture-template/validateTemplate.test.ts`
  - `tests/lecture-template/lecture-components.test.tsx`
  - `examples/component-demo.template.md`
  - `SKILL.md`

## Checklist

- [x] Run `npm run typecheck` and confirm no TypeScript errors.
- [x] Run `npm run test -- tests/lecture-template/validateTemplate.test.ts` and confirm all pass.
- [x] Run `npm run test -- tests/lecture-template/lecture-components.test.tsx` and confirm all pass.
- [x] Run `npm run test -- tests/lecture-template/fixtures.test.ts` and confirm all pass.
- [x] Run `npm run validate` and confirm the component demo fixture passes.
- [x] Run `npm run test` (full suite) and confirm no regressions.
- [x] Run `npm run lint` and confirm no lint errors.
- [x] Confirm `DiagramComponent` type is exported from `types.ts`.
- [x] Confirm `"diagram"` is in `LectureComponentType` and `LectureComponent` unions.
- [x] Confirm `"diagram"` is in `supportedComponents` in `validateTemplate.ts`.
- [x] Confirm `Diagram.tsx` exists with `"use client"` directive.
- [x] Confirm `SectionRenderer.tsx` imports and dispatches `Diagram`.
- [x] Confirm CSS classes `.diagram-card`, `.diagram-svg-container`, `.diagram-error` exist in `globals.css`.
- [x] Confirm print styles for `.diagram-card` exist in `globals.css`.
- [x] Confirm `mermaid` is in `package.json` dependencies.
- [x] Confirm component demo has all 8 diagram types as valid examples.
- [x] Confirm SKILL.md documents the diagram component.
- [x] Confirm no new runtime dependencies besides `mermaid`.
- [x] Confirm no changes to existing component types, parser behavior, or validator rules for other components.
- [x] Check `git status` and summarize files relevant to this spec.

## Expected Behavior

- All tests pass.
- Lint and typecheck are clean.
- The component demo validates as a valid lecture template.
- Existing components are unaffected by the diagram addition.
- Documentation and examples are consistent with the implementation.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run test -- tests/lecture-template/validateTemplate.test.ts
npm run test -- tests/lecture-template/lecture-components.test.tsx
npm run test -- tests/lecture-template/fixtures.test.ts
npm run validate
npm run test
```

## Cleanup Notes

- Restore `content/lecture.template.md` if it was changed for manual demo or package verification.
- Do not revert unrelated uncommitted work; report unrelated changes separately if they appear in `git status`.
