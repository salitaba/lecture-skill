# Task 07: Align User/Maintainer Documentation and Run Final Verification

## Objective

Complete the user-facing source-evidence explanation and verify the full implementation/documentation contract across validation, tests, linting, type checking, builds, and a temporary consumer workflow.

## Dependencies

- Complete Tasks 01–06.
- This task is the final consistency and verification boundary; do not introduce new behavior or product decisions.

## Exact Files to Modify

- `README.md`
- `DEVELOPMENT.md`

No production or test files should be modified in this task unless a prior task is demonstrably incomplete; record such a defect against the responsible task instead.

## Implementation Details

- Update `README.md` to say users supply human raw source, agents generate lecture templates/derived review artifacts, and neither `content/raw-lecture.txt` nor `lectures/<slug>/raw-lecture.txt` nor `lectures/raw-course.txt` is agent-generated output.
- Explain that `lectures/raw-course.txt` is optional shared evidence for a real course spanning multiple lectures, is read by review tooling when present, and is loaded into agent context only for an explicitly requested shared-source workflow. Do not imply that its presence alone opts the agent in.
- Explain that scaffold raw files are marked placeholders, do not count as evidence, and must be replaced before authoring/review approval. State that the system cannot verify whether user-pasted source was AI-generated.
- Update `DEVELOPMENT.md` with the centralized `present`/`missing`/`placeholder` contract, primary/shared roles, non-copying of placeholders, expected review commands, and the boundary that no schema, route, progress, or AI-generation API changes are involved.
- Keep the README focused on workflow and link to `SKILL.md` for the full authoring schema; keep terminology consistent with worksheet, doctor, and package output.
- Run the complete verification commands and a manual temporary consumer check: `npx lecture-site-engine init` creates marked per-lecture placeholders but no shared-course file; existing human per-lecture/shared sources remain unchanged; after adding real sources, review/doctor/package workflows report and copy only present evidence.
- Review the final diff and confirm only the seven `022-remove-raw-text-*` task files are changed in this decomposition turn; implementation agents must not modify the spec or finalized plan while executing the tasks.

## Acceptance Criteria

- README and DEVELOPMENT consistently describe human source ownership, optional shared course evidence, placeholder semantics, and the provenance limitation.
- Documentation does not promise AI-authorship detection or automatic shared-source context.
- All automated checks pass, and the consumer smoke test confirms init/scaffold/preserve/package behavior.
- No schema, route, progress, or package path contract is changed beyond additive placeholder status and explanatory labels.

## Verification / Tests

```bash
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run build:cli
```

Manual smoke test in a disposable consumer workspace:

```bash
npx lecture-site-engine init
npx lecture-site-engine review:source
npx lecture-site-engine doctor
npx lecture-site-engine package:review
```

Use a temporary workspace with valid template(s), a real per-lecture source, an optional real `lectures/raw-course.txt`, and an unrelated raw-like file. Confirm the package contains only canonical present evidence and leaves the source workspace unchanged.

## Cleanup Notes

- Remove only temporary consumer workspaces, build output, and package staging created by verification; never remove repository/user raw sources or review artifacts.
- Preserve any pre-existing worktree changes and do not modify `spec/022-remove-raw-text.txt` or `spec/imp-plan/022-remove-raw-text-plan.txt`.
