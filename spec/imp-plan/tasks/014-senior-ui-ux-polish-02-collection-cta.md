# Task 02: Add Primary Course CTA and Resume Targeting

## Goal

Add a primary course CTA (Start/Resume/Continue) to the collection landing page with proper resume targeting based on progress.

## Files to Create/Modify

- **Create**: `src/lib/lecture-template/resumeTarget.ts` (new pure helper module)
- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Create**: `src/components/lecture-kit/CollectionPrimaryAction.tsx` (new client component)
- **Create**: `tests/lecture-template/resume-target.test.ts` (new test file)
- **Create**: `tests/lecture-template/collection-cta.test.tsx` (new test file)

## Checklist

- [ ] Create pure helper `calculateResumeTarget` in `resumeTarget.ts` that determines CTA label and href based on collection progress
- [ ] Implement CTA label logic:
  - `Start course` when no progress exists
  - `Resume course` when progress indicates incomplete section
  - `Continue course` when progress exists but precise target unavailable
- [ ] Implement href logic:
  - First valid lecture when no progress
  - First incomplete section anchor within first partially complete lecture
  - First valid lecture when malformed/empty/all completed
- [ ] Create `CollectionPrimaryAction` client component that reads collection progress and renders CTA
- [ ] Update `CollectionLanding` to render CTA near title/description before progress and assessment index
- [ ] Move assessment index below lecture list or behind disclosure
- [ ] Make validation/pass badges subordinate to lecture card title/action
- [ ] Add pure helper tests for CTA target calculation
- [ ] Add component tests for CTA rendering and behavior

## Expected Behavior

The collection landing page should:
1. Display a prominent primary CTA near the top (after title/description)
2. CTA text changes based on progress state:
   - "Start course" for new learners
   - "Resume course" when progress exists
   - "Continue course" as fallback
3. CTA links to appropriate lecture/section based on progress
4. Assessment index moved below lecture list
5. Validation badges visually subordinate to lecture titles
6. Compact metadata (lecture count, duration, level) visible but secondary

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/resume-target.test.ts
npm run test -- tests/lecture-template/collection-cta.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure tests cover edge cases: empty progress, malformed progress, all complete, first lecture invalid
