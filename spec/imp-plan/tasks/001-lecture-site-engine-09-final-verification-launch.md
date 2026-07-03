# 001 Lecture Site Engine - 09 Final Verification And Launch Protocol

## Goal

Run the automated, manual, and launch-decision verification required by the finalized plan, including golden-leakage preflight and the three-run Codex golden conversion batch.

## Dependencies

- `001-lecture-site-engine-01-scaffold.md`
- `001-lecture-site-engine-02-parser-anchors.md`
- `001-lecture-site-engine-03-validator.md`
- `001-lecture-site-engine-04-validation-fixtures-cli.md`
- `001-lecture-site-engine-05-rendering-route-validation-screen.md`
- `001-lecture-site-engine-06-component-kit-markdown-safety.md`
- `001-lecture-site-engine-07-content-examples.md`
- `001-lecture-site-engine-08-docs-and-skill.md`

## Exact Files To Create Or Modify

- `docs/golden-conversion-batch.md`
- `docs/mvp-review-checklist.md`
- `docs/educator-usefulness-log.md`

If verification reveals a defect or missing assertion, stop and return to the earlier task file that owns that slice rather than broadening this task. For example, parser defects belong to task 02 or 03, CLI fixture gaps belong to task 04, route/rendering defects belong to task 05 or 06, and documentation gaps belong to task 08.

## Checklist

- [x] Run `npm install` under Node.js 24 LTS.
- [x] Run the full automated test suite.
- [x] Run `npm run validate` and confirm the active template passes.
- [x] Run `npm run dev` and open `http://localhost:3000`.
- [x] Confirm the active template renders:
  - [x] title
  - [x] description
  - [x] audience
  - [x] duration
  - [x] level
  - [x] overview
  - [x] learning objectives
  - [x] ordered sections
  - [x] section navigation
  - [x] at least one useful visual component
  - [x] key takeaways
- [ ] Confirm invalid active content shows the blocking validation screen and no partial lecture content.
- [x] Confirm all P0 invalid fixtures produce author-locatable blocking validation errors.
- [ ] Manually check no horizontal overflow at 390px viewport width.
- [ ] Manually check no horizontal overflow at 1280px viewport width.
- [ ] Manually check section navigation is usable at 390px.
- [ ] Manually check readable code blocks, clear visual hierarchy, keyboard focusability, visible focus states, and text contrast.
- [ ] Preserve the active template, copy `examples/component-demo.template.md` to `content/lecture.template.md`, run validation, preview every supported component type, then restore the active template.
- [ ] Run golden-leakage preflight:
  - [ ] Confirm `README.md` does not expose the golden answer.
  - [ ] Confirm `SKILL.md` does not expose the golden answer.
  - [ ] Confirm other agent-accessible docs do not include a section-by-section expected conversion derived from `examples/raw-lecture.txt`.
  - [ ] Create a clean generation workspace.
  - [ ] Remove, hide, or make inaccessible `examples/golden.template.md` before each generation run.
  - [ ] Remove or replace any golden-revealing `content/lecture.template.md` with a minimal non-golden placeholder before each generation run.
  - [ ] Preserve a reviewer copy of `examples/golden.template.md` outside the agent-accessible workspace.
- [ ] Record the selected Codex evaluation baseline in `docs/golden-conversion-batch.md`:
  - [ ] product surface
  - [ ] model identifier when exposed, or unavailable note
  - [ ] date
  - [ ] repository commit or working tree state
- [ ] Run the exact three-run golden prompt from the spec in fresh Codex sessions.
- [ ] For each run, allow the agent to run validation and iterate, but do not manually repair schema shape, fields, headings, component syntax, or component payloads.
- [ ] After each run validates or fails, restore reviewer access to `examples/golden.template.md` only for comparison.
- [ ] Apply `docs/mvp-review-checklist.md` to each launch-counted generated lecture.
- [ ] Record validation output, generation workspace setup, golden inaccessibility proof, starting active template status, checklist result, and pass/fail outcome for each run in `docs/golden-conversion-batch.md`.
- [ ] Confirm at least two of three runs pass validation and every checklist item without manual schema fixes before calling the result MVP launch-ready.
- [ ] Run or record the non-blocking educator usefulness check in `docs/educator-usefulness-log.md`, or document why it is accepted as follow-up.

## Expected Behavior

- Automated parser, validation, CLI, fixture, rendering-model, and Markdown-safety tests pass.
- The active lecture can be validated and previewed locally at `http://localhost:3000`.
- Invalid templates block rendering with useful author-locatable errors.
- The component demo validates and previews all supported MVP component types.
- The golden conversion launch batch is reproducible and recorded.
- MVP launch readiness requires at least two of three sanitized golden Codex runs to pass validation and the review checklist.
- Any implementation or test defect found during final verification is sent back to the owning earlier task before this final verification task is rerun.

## Verification Commands

```bash
node --version
npm install
npm run test
npm run validate
npm run dev
```

Use browser viewport checks at 390px and 1280px while `npm run dev` is running.

## Cleanup Notes

- Stop the dev server after manual verification.
- Restore `content/lecture.template.md` after invalid-template and component-demo checks.
- Remove temporary clean generation workspaces after their setup and results are recorded.
- Keep reviewer-only golden copies outside the agent-accessible generation workspace.
- Do not commit `.next/`, coverage output, temporary workspaces, or accidental copies of sanitized-run artifacts unless the plan explicitly requires the evidence in `docs/golden-conversion-batch.md`.
