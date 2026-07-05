# Task: Implement ProgressProvider

## Goal

Add a client-side React provider that owns lecture progress state, validates localStorage data on load, debounces writes, and exposes the P0 context contract.

## Dependencies

- `012-progress-tracking-01-model-storage.md`

## Exact Files To Create Or Modify

- `src/components/lecture-kit/progress/ProgressProvider.tsx` - New client provider/context.
- `src/components/lecture-kit/progress/useProgress.ts` - Optional small hook if not colocated with the provider.
- `tests/lecture-template/progress-provider.test.tsx` - New jsdom tests.

## Checklist

- [x] Create a `"use client"` provider with props for storage key, section anchors/titles, and optional lecture slug.
- [x] Expose `{ progress, toggleSection, resetProgress, totalSections, completedSections, percentComplete }`.
- [x] Read localStorage only after mount and guard all browser APIs.
- [x] Parse and validate stored JSON with the pure helpers.
- [x] Log a console warning and continue without breaking the page when storage is unavailable or corrupted.
- [x] Debounce writes by 300ms after progress changes.
- [x] Cancel pending writes on reset and remove the storage key immediately.
- [x] Avoid writing initial empty state before the first storage read completes.
- [x] Add tests for load, toggle, debounce, reset, corruption recovery, quota/storage failures, and unavailable storage.

## Expected Behavior

Lecture progress survives reloads when localStorage is available, updates do not spam storage writes, and storage failures leave the lecture readable.

## Verification Commands

```bash
npm run test -- tests/lecture-template/progress-provider.test.tsx
npm run test -- tests/lecture-template/progress-model.test.ts
```

## Cleanup Notes

Use jsdom localStorage and fake timers in tests. Clear localStorage, restore timers, restore console spies, and call `cleanup()` after each test.
