# Task 11: Update ProgressProvider for Collection Mode

## Goal

Ensure lecture pages in collection mode use collection-scoped progress rather than single-lecture storage.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/progress/ProgressProvider.tsx`
- **Modify**: `src/components/lecture-kit/LecturePage.tsx`
- **Create**: `tests/lecture-template/collection-progress-integration.test.tsx` (new test file)

## Checklist

- [ ] Update `ProgressProvider` to accept optional collection context
- [ ] When in collection mode, use collection-scoped storage key
- [ ] Ensure progress toggles update both lecture and collection progress
- [ ] Verify resume targeting works with collection progress
- [ ] Add tests for collection progress integration
- [ ] Ensure backward compatibility with single-lecture mode

## Expected Behavior

When in collection mode:
1. Lecture progress should be stored in collection-scoped localStorage key
2. Progress toggles should update both lecture and collection progress
3. Resume targeting should work across lectures
4. Single-lecture mode should remain unchanged

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/collection-progress-integration.test.tsx
npm run test -- tests/lecture-template/progress-provider.test.tsx
npm run test -- tests/lecture-template/collection.test.ts
```

## Cleanup Notes

- No data cleanup required
- Ensure no breaking changes to existing progress behavior
