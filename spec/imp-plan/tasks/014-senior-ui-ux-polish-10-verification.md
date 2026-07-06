# Task 10: Verification and Screenshot Evidence

## Goal

Run full test suite and verify visual behavior across viewports.

## Files to Create/Modify

- **Create**: `tests/lecture-template/screenshot-verification.test.tsx` (new test file)
- **Create**: `docs/014-senior-ui-ux-polish-screenshots.md` (new screenshot evidence document)

## Checklist

- [ ] Run focused automated tests:
  - `npm run test -- tests/lecture-template/lecture-components.test.tsx`
  - `npm run test -- tests/lecture-template/lecture-navigation.test.tsx`
  - `npm run test -- tests/lecture-template/progress-provider.test.tsx`
  - `npm run test -- tests/lecture-template/progress-model.test.ts`
  - `npm run test -- tests/lecture-template/collection.test.ts`
  - `npm run test -- tests/lecture-template/quiz-interaction.test.tsx`
  - `npm run test -- tests/lecture-template/assessment-interaction.test.tsx`
  - `npm run test -- tests/lecture-template/backward-compat.test.tsx`
  - `npm run test -- tests/lecture-template/review-package.test.ts`
- [ ] Run broad verification:
  - `npm run test`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run validate`
  - `npm run build`
  - `npm run package:review`
- [ ] Add browser verification tests using multi-lecture fixtures:
  - Collection landing at 390px, 768px, 1280px
  - Short lecture route
  - Long/component-heavy lecture route
  - Mobile quiz selection/check interaction
  - Print preview for answer/guidance visibility
- [ ] Use `document.documentElement.scrollWidth <= document.documentElement.clientWidth` for overflow checks
- [ ] Capture or document screenshot paths for review evidence

## Expected Behavior

Verification should:
1. Pass all existing tests
2. Pass new tests for enhanced features
3. Show no horizontal overflow at key viewports
4. Demonstrate collection CTA visibility at mobile width
5. Show lecture content without excessive chrome at 390px
6. Document screenshot evidence for review

## Verification Command(s)

```bash
npm run test
npm run typecheck
npm run lint
npm run validate
npm run build
npm run package:review
```

## Cleanup Notes

- Clean up any test-generated data in `out/` or `review-packages/`
- Ensure screenshot evidence is documented for review
