# Scrollbar Fix Summary

## Issue
The user reported that the scrollbar on the dashboard page was automatically disabling (disappearing) after a few seconds.

## Investigation
- Analyzed `src/app.css` and found a `body.page-transitioning` rule that applied `overflow: hidden !important`.
- This rule also included a safety animation `resetOverflow` intended to restore `overflow: visible` after 1 second.
- The interaction between the class application, the `!important` flag, and the animation likely caused the overflow to remain hidden or behave unpredictably.
- Analyzed `src/lib/components/TransitionOverlay.svelte` which manages the `page-transitioning` class.

## Fix
1. **Modified `src/app.css`**:
   - Removed `overflow: hidden !important` from `body.page-transitioning`.
   - Removed the `resetOverflow` animation and keyframes.
   - This ensures that CSS alone does not aggressively hide the scrollbar.

2. **Updated `src/lib/components/TransitionOverlay.svelte`**:
   - Added explicit JavaScript control for overflow.
   - When `$isTransitioning` is true, `document.body.style.overflow = 'hidden'` is set.
   - When `$isTransitioning` is false, `document.body.style.removeProperty('overflow')` is called.
   - This moves the logic from CSS (which can be sticky or overridden) to explicit JS state management, ensuring the scrollbar is only hidden exactly when a transition is active.

## Verification
- The `page-transitioning` class is now only used for `pointer-events: none`.
- Scroll locking is handled dynamically by the `TransitionOverlay` component.
- If the transition state is false (default), the scrollbar will remain visible.
