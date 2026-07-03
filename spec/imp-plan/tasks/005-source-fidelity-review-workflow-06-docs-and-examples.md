# Task: Docs And Examples

**Goal**: Document the source fidelity review workflow for authors, reviewers, and AI agents, and add only the example raw-source files needed by the documented workflows.

**Dependencies**: `005-source-fidelity-review-workflow-03-review-source-cli.md`, `005-source-fidelity-review-workflow-05-package-worksheet-manifest.md`

## Files to Create/Modify

- `README.md` — Document raw source conventions, `npm run review:source`, package evidence behavior, and example workflows
- `SKILL.md` — Update AI-agent instructions for preserving raw source files and creating review artifacts
- `examples/multi-lecture/README.md` — Create or update only if the multi-lecture example scaffold is restored
- `examples/multi-lecture/lectures/01-introduction/lecture.template.md` — Restore/add if needed for documented collection examples
- `examples/multi-lecture/lectures/02-core-concepts/lecture.template.md` — Restore/add if needed for documented collection examples
- `examples/multi-lecture/lectures/01-introduction/raw-lecture.txt` — Add only if referenced by docs/tests
- `examples/multi-lecture/lectures/02-core-concepts/raw-lecture.txt` — Add only if referenced by docs/tests
- `examples/multi-lecture/lectures/raw-course.txt` — Add only if documenting the shared-source collection workflow

## Checklist

- [x] Document single-lecture raw source convention: `content/raw-lecture.txt` plus `content/lecture.template.md`.
- [x] Document per-lecture collection raw source convention: `lectures/<slug>/raw-lecture.txt` plus `lectures/<slug>/lecture.template.md`.
- [x] Document shared collection source convention: `lectures/raw-course.txt`.
- [x] Explain that when both per-lecture and shared sources exist, per-lecture source is primary and shared source is additional context.
- [x] Document `npm run review:source`, including that it runs validation, creates a worksheet even when validation fails, and exits `0` when worksheet creation succeeds.
- [x] Document that source fidelity is a human review workflow and does not perform semantic fact-checking.
- [x] Document `npm run package:review` source-evidence behavior, including missing-source warnings and package `REVIEW_WORKSHEET.md`.
- [x] Add example workflows for single-source, per-lecture source, and shared-source collection review.
- [x] Update `SKILL.md` to instruct AI agents to preserve raw source files and never overwrite them with generated prose.
- [x] Update `SKILL.md` to run `npm run validate`, then `npm run review:source`, and use `npm run package:review` for portable handoff artifacts.
- [x] Restore/add the multi-lecture example scaffold before referencing collection source-review examples that depend on it.
- [x] Add only example raw source files used by README/tests.

## Expected Behavior

- Authors and AI agents have deterministic instructions for where raw source evidence belongs.
- Reviewers know to use generated worksheets and package-local `REVIEW_WORKSHEET.md`.
- Documentation does not imply automatic factual scoring or mandatory inclusion of confidential raw source.

## Verification

```bash
npm run validate
npm run test -- tests/lecture-template/source-review.test.ts tests/lecture-template/review-package.test.ts
```

Manual verification:

```bash
npm run review:source
npm run package:review
```

## Cleanup Notes

- Remove local-only generated worksheets and review packages from manual documentation checks if they are not intended for handoff.
- Do not remove or overwrite user-provided raw lecture source files while testing docs examples.
