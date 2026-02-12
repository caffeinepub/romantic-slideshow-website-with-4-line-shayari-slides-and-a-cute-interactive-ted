import { useEffect, RefObject } from 'react';

interface UseSwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  elementRef: RefObject<HTMLElement | null>;
  threshold?: number;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  elementRef,
  threshold = 50,
}: UseSwipeNavigationProps) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swiped left
          onSwipeLeft();
        } else {
          // Swiped right
          onSwipeRight();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, elementRef, threshold]);
}
