# Task: Collection Types and Scanning Module

**Goal**: Add collection types to the type system and create the `collection.ts` module that scans the `lectures/` directory structure.

**Dependencies**: None (first task)

## Files to Create/Modify

- `src/lib/lecture-template/types.ts` — Add `LectureCollectionEntry`, `LectureCollection`, `LectureValidationResult`, `CollectionValidationResult`
- `src/lib/lecture-template/collection.ts` — New module for collection scanning and validation
- `src/lib/lecture-template/readTemplate.ts` — Add `LECTURES_DIR` export and `readLectureEntry()` function

## Checklist

### types.ts additions
- [ ] Add `LectureCollectionEntry` interface with `slug`, `order`, `templatePath`
- [ ] Add `LectureCollection` interface with `basePath`, `entries`
- [ ] Add `LectureValidationResult` interface with `slug`, `templatePath`, `valid`, `errors`, optional `template`
- [ ] Add `CollectionValidationResult` interface with `lectureCount`, `results`, `allPassed`

### readTemplate.ts additions
- [ ] Export `LECTURES_DIR = "lectures"` constant
- [ ] Add `readLectureEntry(entry: LectureCollectionEntry): Promise<string>` that reads `repositoryPath(entry.templatePath)`

### collection.ts creation
- [ ] Create `LECTURES_DIR` constant (same value as in readTemplate.ts)
- [ ] Implement `isCollectionMode(): Promise<boolean>` — checks if `lectures/` directory exists and contains at least one subdirectory with `lecture.template.md`
- [ ] Implement `scanLectureCollection(): Promise<LectureCollection>` — reads directory entries, matches `/^\d{2}-(.+)$/` pattern, extracts numeric prefix, sorts by prefix, returns collection. Skip non-matching directories.
- [ ] Implement `readLectureEntry(entry: LectureCollectionEntry): Promise<string>` — delegates to `readTemplate.ts` function
- [ ] Implement `validateCollection(): Promise<CollectionValidationResult>` — scans collection, reads each template, calls `validateTemplateSource()`, aggregates results. Each lecture validates independently.

## Expected Behavior

- `isCollectionMode()` returns `false` when `lectures/` doesn't exist or is empty
- `isCollectionMode()` returns `true` when `lectures/` has at least one valid subdirectory
- `scanLectureCollection()` returns entries sorted by numeric prefix
- `validateCollection()` returns results for all lectures, with `allPassed: true` only if every lecture passes

## Verification

```bash
npm run typecheck
npm run test -- tests/lecture-template/collection.test.ts
```

## Notes

- Use `node:fs/promises` and `node:path` for filesystem operations (matching existing patterns in `readTemplate.ts`)
- The `repositoryPath()` helper in `readTemplate.ts` resolves relative paths from `process.cwd()`
- Non-matching directory names should be silently skipped (not error)
