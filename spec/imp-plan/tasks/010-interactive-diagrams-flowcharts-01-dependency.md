# Task: Install Mermaid.js Dependency

## Goal

Add `mermaid` as a project dependency pinned to `^10.x` so diagrams can be dynamically imported at runtime.

## Dependencies

- Finalized plan: `spec/imp-plan/010-interactive-diagrams-flowcharts-plan.txt`

## Exact Files To Create Or Modify

- `package.json` - Add `mermaid` to `dependencies`.

## Checklist

- [x] Run `npm install mermaid@^10`.
- [x] Verify `mermaid` appears in `package.json` under `dependencies` (not `devDependencies`).
- [x] Verify the resolved version is `10.x`.

## Expected Behavior

- `npm install` succeeds without peer-dependency conflicts.
- `mermaid` is listed in `package.json` dependencies with a `^10.x` range.

## Verification Commands

```bash
node -e "const pkg = require('./package.json'); console.log(pkg.dependencies.mermaid)"
npm run typecheck
```

## Cleanup Notes

- This task should not create temporary data.
- If `npm install` modifies `package-lock.json`, that is expected and required.
