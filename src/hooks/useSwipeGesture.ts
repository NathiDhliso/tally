import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  velocityThreshold?: number; // Minimum velocity to trigger swipe
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  distance: number;
}

export const useSwipeGesture = (
  elementRef: React.RefObject<HTMLElement | null>,
  options: SwipeGestureOptions = {}
) => {
  const {
    onSwipeDown,
    onSwipeUp,
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    velocityThreshold = 0.3,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    distance: 0,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchMoveRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      touchMoveRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Determine direction
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      let distance = 0;

      if (absY > absX) {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up';
        distance = absY;
      } else {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left';
        distance = absX;
      }

      setSwipeState({
        isSwiping: true,
        direction,
        distance,
      });
    };

    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) {
        setSwipeState({ isSwiping: false, direction: null, distance: 0 });
        return;
      }

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Calculate velocity (pixels per millisecond)
      const velocityX = absX / deltaTime;
      const velocityY = absY / deltaTime;

      // Determine if swipe threshold is met
      if (absY > absX) {
        // Vertical swipe
        if (absY > threshold || velocityY > velocityThreshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      } else {
        // Horizontal swipe
        if (absX > threshold || velocityX > velocityThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      }

      // Reset state
      setSwipeState({ isSwiping: false, direction: null, distance: 0 });
      touchStartRef.current = null;
      touchMoveRef.current = null;
    };

    // Mouse events for desktop testing
    let isMouseDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      touchStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
      touchMoveRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || !touchStartRef.current) return;

      touchMoveRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      const deltaX = e.clientX - touchStartRef.current.x;
      const deltaY = e.clientY - touchStartRef.current.y;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      let distance = 0;

      if (absY > absX) {
        direction = deltaY > 0 ? 'down' : 'up';
        distance = absY;
      } else {
        direction = deltaX > 0 ? 'right' : 'left';
        distance = absX;
      }

      setSwipeState({
        isSwiping: true,
        direction,
        distance,
      });
    };

    const handleMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      handleTouchEnd();
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    element.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [elementRef, onSwipeDown, onSwipeUp, onSwipeLeft, onSwipeRight, threshold, velocityThreshold]);

  return swipeState;
};
