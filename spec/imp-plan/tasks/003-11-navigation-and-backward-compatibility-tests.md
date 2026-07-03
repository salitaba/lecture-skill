# Task: Navigation And Backward Compatibility Tests

**Goal**: Add focused tests for lecture navigation markup and collection-mode backward compatibility.

**Dependencies**: Tasks 2, 3, 5, and 7

## Files to Create/Modify

- `tests/lecture-template/lecture-navigation.test.tsx`
- `tests/lecture-template/backward-compat.test.ts`

## Checklist

### lecture-navigation.test.tsx
- [ ] Test the first-lecture case renders only Next and Back to course links
- [ ] Test the middle-lecture case renders Previous, Back to course, and Next links
- [ ] Test the last-lecture case renders only Previous and Back to course links
- [ ] Test all links point to the expected `/lectures/<slug>` routes or `/`
- [ ] Test the navigation markup exposes the expected semantic container and class hooks

### backward-compat.test.ts
- [ ] Test that when `lectures/` is absent, the root page still renders the single lecture from `content/lecture.template.md`
- [ ] Test that when `lectures/` exists, the root page switches to collection mode even if `content/lecture.template.md` is still present
- [ ] Test that collection mode ignores `content/lecture.template.md` for rendering precedence
- [ ] Use isolated filesystem setup so the test does not depend on the developer's working tree

## Expected Behavior

- Navigation links are correct at the edges and in the middle of the collection
- The root page keeps the single-lecture workflow intact when no collection exists
- Collection precedence is deterministic and visible in tests

## Verification

```bash
npm run test -- tests/lecture-template/lecture-navigation.test.tsx tests/lecture-template/backward-compat.test.ts
npm run typecheck
```

## Notes

- Keep the tests server-component friendly; do not introduce client-only helpers unless they are already required by the repo's test pattern
- If a test needs to stub the filesystem or Next.js navigation, keep the mocks local to the file
