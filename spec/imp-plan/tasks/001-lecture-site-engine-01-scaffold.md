# 001 Lecture Site Engine - 01 Scaffold

## Goal

Create the initial npm, Next.js, TypeScript, test, and directory scaffold required by the finalized plan, without implementing the full parser, renderer, or documentation content yet.

## Dependencies

None.

## Exact Files To Create Or Modify

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/lib/lecture-template/.gitkeep` or first placeholder module files
- `src/components/lecture-kit/.gitkeep` or first placeholder component files
- `scripts/validate.ts`
- `tests/lecture-template/.gitkeep` or first placeholder test file
- `content/.gitkeep` or placeholder content files created by later tasks
- `examples/.gitkeep`
- `docs/.gitkeep`

## Checklist

- [x] Initialize a standard npm project using Next.js, React, TypeScript, and the App Router.
- [x] Add `package.json` scripts:
  - [x] `dev` runs the local preview server.
  - [x] `validate` runs `scripts/validate.ts`.
  - [x] `test` runs the TypeScript-friendly test runner.
  - [x] Add lint/typecheck scripts if supported by the scaffold.
- [x] Add `package.json` `engines.node` with `>=24`.
- [x] Generate `package-lock.json` from `npm install`.
- [x] Configure TypeScript for the app, library code, scripts, and tests.
- [x] Configure the selected test runner, such as Vitest, so `tests/lecture-template/*.test.ts` can execute without browser dependencies.
- [x] Create the planned source directories under `src/app/`, `src/lib/lecture-template/`, and `src/components/lecture-kit/`.
- [x] Create a minimal `src/app/layout.tsx` that imports `src/app/globals.css`.
- [x] Create a temporary minimal `src/app/page.tsx` that can compile before the parser and renderer tasks are implemented.
- [x] Create a temporary `scripts/validate.ts` that exits successfully only until validation is implemented in later tasks.
- [x] Keep all implementation placeholders small and remove or replace them in later tasks.

## Expected Behavior

- The repository has a working Next.js/TypeScript/npm baseline.
- The Node runtime requirement is enforced in project metadata with `engines.node >=24`.
- The scaffold creates the planned directories without introducing alternate architecture or routes.
- `npm run dev`, `npm run validate`, and `npm run test` are valid script names, even if later tasks replace placeholder behavior.

## Verification Commands

```bash
npm install
npm run test
npm run validate
npm run dev
```

For `npm run dev`, verify the local server starts and serves `http://localhost:3000`; stop the server after the smoke check.

## Cleanup Notes

- Stop the dev server after the smoke check.
- Do not commit generated runtime caches such as `.next/`, coverage output, or test temp directories.
