# Task 05: Make Scaffold Placeholders Explicit and Preserve Human Sources

## Objective

Ensure initialization and new-lecture scaffolds create only clearly marked per-lecture placeholders, never create `lectures/raw-course.txt`, and preserve any existing human-authored source files.

## Dependencies

- Task 02: import the centralized placeholder sentinel instead of duplicating marker text.
- Task 01: distributed skill files already describe source ownership and opt-in shared context.

## Exact Files to Modify

- `src/lib/lecture-template/scaffold.ts`
- `src/cli/commands/init.ts`
- `src/cli/commands/newCollection.ts` (only if command messaging needs the placeholder distinction)
- `src/cli/commands/newLecture.ts` (only if command messaging needs the placeholder distinction)
- `scripts/newCollection.ts` (keep output aligned if command messaging changes)
- `scripts/newLecture.ts` (keep output aligned if command messaging changes)

## Implementation Details

- Keep the current command matrix: `init` and `new:collection` create the collection/course metadata, first lecture template, and marked per-lecture raw placeholder; collection `new:lecture` creates the next template and marked per-lecture placeholder; single-mode `new:lecture` creates only the template.
- Use the shared sentinel from `rawSourceEvidence.ts` for every generated per-lecture placeholder. Do not create a shared-course placeholder and do not create `lectures/raw-course.txt` automatically.
- Preserve existing non-overwrite behavior: `init` skips existing skill files and preserves an existing project; collection scaffolding refuses an existing `lectures/`; new collection lectures use exclusive creation for template/raw files; no command writes to an existing raw lecture or shared course source.
- Make `ScaffoldResult.message`/next-step output and `init` output say that the raw file is a scaffold placeholder and the user must replace it with real human course material before asking an agent to author or requesting source-fidelity approval.
- Keep single-lecture compatibility and existing created-path reporting. Do not add any AI generation, source summarization, automatic shared-source creation, or raw-source rewrite path.
- Keep `AGENTS.md` and `CLAUDE.md` repository guidance out of the files copied by `init.ts`; only the three distributed skill entry points remain installed.

## Acceptance Criteria

- All collection scaffold modes produce the exact per-lecture placeholder text and classify it as `placeholder`, not `present`.
- No scaffold or init mode creates `lectures/raw-course.txt`.
- Existing per-lecture raw sources and existing `lectures/raw-course.txt` contents are byte-for-byte unchanged after init/new commands.
- Single mode still creates only `content/lecture.template.md`, and existing templates remain protected.
- User-facing command output distinguishes a placeholder from human-authored source and gives the replacement next step.

## Verification / Tests

```bash
npm test -- tests/lecture-template/init.test.ts tests/lecture-template/scaffold.test.ts
npm run typecheck
```

Task 06 adds the complete preservation matrix, including an existing shared source and the absence of automatic shared-source creation.

## Cleanup Notes

- Run scaffold/init tests only inside `mkdtempSync(os.tmpdir())` workspaces and restore the repository working directory.
- Do not remove any existing user file to make a scaffold test pass.
