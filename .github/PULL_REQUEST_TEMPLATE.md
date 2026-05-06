## Summary

<!-- One or two sentences. What does this PR do, and why? -->

## Changes

<!-- Bullet list of the meaningful changes — file groups or behaviours,
     not a literal commit log. -->

-
-

## Screenshots / recordings

<!-- For any UI change, attach a before/after screenshot or a short clip.
     Delete this section if there is no visible change. -->

## How to test

<!-- Steps a reviewer can follow locally to validate the change.
     `npm run dev`, navigate to ..., click ..., expect ... -->

1.
2.

## Checklist

- [ ] `npm run lint` passes
- [ ] `npx prettier --check .` passes
- [ ] `npm run build` passes
- [ ] No new `style={{}}` introduced (use Tailwind utilities, or document the runtime exception)
- [ ] No new custom CSS classes added to `app/globals.css` (the file is frozen pending design-system token finalisation — see the comment block at the top)
- [ ] Accessibility: focus rings visible, touch targets ≥ 44×44, semantic HTML where applicable
- [ ] Updated relevant JSDoc / inline comments

## Notes for the reviewer

<!-- Things you want a second pair of eyes on, trade-offs you made,
     or anything you're not 100% sure about. -->
