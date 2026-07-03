# Task: Example Multi-Lecture Collection Fixtures

**Goal**: Add a documented two-lecture example collection under `examples/multi-lecture/` and keep it covered by the fixture test suite.

**Dependencies**: Tasks 1 to 7

## Files to Create/Modify

- `examples/multi-lecture/lectures/01-introduction/lecture.template.md`
- `examples/multi-lecture/lectures/02-core-concepts/lecture.template.md`
- `tests/lecture-template/fixtures.test.ts` — include the new example collection templates in the valid fixture list

## Checklist

### Example collection creation
- [ ] Create `examples/multi-lecture/lectures/01-introduction/lecture.template.md` as a valid lecture with the existing template schema
- [ ] Create `examples/multi-lecture/lectures/02-core-concepts/lecture.template.md` as a valid follow-on lecture with the same schema
- [ ] Use numbered subdirectories so the collection sorts in authored order
- [ ] Keep both lectures self-contained and valid with only supported components

### Fixtures test update
- [ ] Add the new example collection lecture files to the valid examples list in `tests/lecture-template/fixtures.test.ts`
- [ ] Keep the invalid fixture assertions unchanged

## Expected Behavior

- The example collection can be copied to a root `lectures/` directory and should behave like a real collection
- The fixture test suite now exercises the new example collection files
- Both example lecture files stay valid under the current schema

## Verification

```bash
npm run test -- tests/lecture-template/fixtures.test.ts
npm run typecheck
```

## Notes

- Keep the example lecture content simple and obviously valid; these files are documentation, not a new feature surface
- Reuse the existing naming pattern for ordered lecture directories
