# Task: Update Learning Loop Authoring And Reviewer Documentation

## Goal

Document explicit objective IDs, assessment references, local review state,
legacy compatibility, and the non-grading posture in the project’s authored
templates, skills, README, examples, and review checklist.

## Dependencies

- `025-learning-loop-mastery-and-review-02-objectives.md`
- `025-learning-loop-mastery-and-review-09-diagnostics-package.md`

## Exact Files To Create Or Modify

- `README.md`
- `SKILL.md`
- `.codex/skills/lecture-site-engine/SKILL.md`
- `content/lecture.template.md`
- `examples/component-demo.template.md`
- `examples/ux-stress.template.md`
- `docs/mvp-review-checklist.md`
- `tests/lecture-template/agent-guidance.test.ts`
- `tests/lecture-template/fixtures.test.ts`
- `tests/lecture-template/source-review.test.ts`

## Checklist

- [x] Document the optional `[objective-id]` authoring convention, explicit
  reference requirements, and deterministic legacy-objective compatibility.
- [x] Explain that objective evidence is local learner state, uses
  “demonstrated recently” language, and is not a grade, certificate, or proof
  of permanent mastery.
- [x] Document the namespaced local review key, learner-controlled ratings,
  no-auto-scheduling rule for untouched assessments, and no-account/no-sync
  boundary.
- [x] Update both agent skills to add IDs/references only when supported by
  source and never fabricate objectives or alter raw-source ownership.
- [x] Add a small source-grounded objective-ID and `objective_refs` example to
  the lecture template and non-raw example templates.
- [x] Add objective-ID and assessment-coverage checks to the MVP review
  checklist.
- [x] Update guidance/fixture/source-review tests to validate the docs and
  confirm the raw-source contract remains explicit.

## Expected Behavior

- Educators and agents can author stable objective references without learning
  state entering source evidence or documentation.
- Documentation consistently describes local-first review and avoids grading or
  definitive mastery claims.

## Verification Commands

```bash
npm run test -- tests/lecture-template/agent-guidance.test.ts tests/lecture-template/fixtures.test.ts tests/lecture-template/source-review.test.ts
npm run validate
npm run typecheck
```

## Cleanup Notes

- Protected raw-source paths are `content/raw-lecture.txt`,
  `lectures/*/raw-lecture.txt`, `lectures/raw-course.txt`, and raw-source
  fixtures under `examples/`; never create, edit, summarize, replace, or
  delete them.
- `examples/golden.template.md` is not a target for this task; preserve the
  golden-conversion workflow and all existing source evidence.
