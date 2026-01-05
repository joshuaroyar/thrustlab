// Swipe gesture detection utility for Svelte 5
// Detects upward swipe gestures and navigates to dashboard

import { goto } from '$app/navigation';

export function useSwipeGesture(element: HTMLElement) {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchEndY = 0;
    let touchEndX = 0;

    const minSwipeDistance = 50; // Minimum distance for a valid swipe
    const maxHorizontalDeviation = 50; // Maximum horizontal movement to still count as vertical swipe

    function handleTouchStart(e: TouchEvent) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }

    function handleTouchMove(e: TouchEvent) {
        touchEndY = e.touches[0].clientY;
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const verticalDistance = touchStartY - touchEndY; // Positive = upward swipe
        const horizontalDistance = Math.abs(touchEndX - touchStartX);

        // Check if it's an upward swipe
        if (
            verticalDistance > minSwipeDistance && // Sufficient upward movement
            horizontalDistance < maxHorizontalDeviation // Not too much horizontal movement
        ) {
            // Navigate to dashboard
            goto('/dashboard');
        }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return {
        destroy() {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        }
    };
}
