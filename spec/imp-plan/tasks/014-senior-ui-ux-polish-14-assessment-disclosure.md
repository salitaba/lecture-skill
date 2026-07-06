# Task 14: Add Assessment Index Disclosure/Grouping

## Goal

Move assessment index behind a disclosure or inside a grouping on collection landing page.

## Files to Create/Modify

- **Modify**: `src/components/lecture-kit/CollectionLanding.tsx`
- **Modify**: `src/app/globals.css`
- **Create**: `tests/lecture-template/assessment-index-disclosure.test.tsx` (new test file)

## Checklist

- [ ] Move assessment index behind a disclosure element
- [ ] Use appropriate disclosure label (e.g., "Assessment locations for reviewers")
- [ ] Keep assessment index accessible when disclosed
- [ ] Add CSS for disclosure styling
- [ ] Add tests verifying disclosure behavior
- [ ] Ensure disclosure is keyboard accessible

## Expected Behavior

Assessment index should:
1. Be behind a disclosure element on collection landing
2. Have appropriate disclosure label
3. Be accessible when disclosed
4. Not block the main course-start journey

## Verification Command(s)

```bash
npm run test -- tests/lecture-template/assessment-index-disclosure.test.tsx
npm run test -- tests/lecture-template/lecture-components.test.tsx
```

## Cleanup Notes

- No data cleanup required
- Ensure assessment index remains accessible for reviewers
