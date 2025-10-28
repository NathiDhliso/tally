/**
 * useParallax Hook
 * 
 * Creates a parallax effect based on mouse movement.
 * Returns transform values that can be applied to elements for depth.
 * 
 * @param strength - Parallax strength multiplier (default: 20)
 * @returns Transform values for x and y
 * 
 * @example
 * const { x, y } = useParallax(30);
 * 
 * <motion.div style={{ x, y }}>
 *   Parallax content
 * </motion.div>
 */

import { useState, useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { throttle } from '../utils/performance';

interface ParallaxOptions {
  strength?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
  throttleMs?: number;
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { 
    strength = 20, 
    springConfig = { stiffness: 150, damping: 30 },
    throttleMs = 16 // ~60fps
  } = options;

  const [isEnabled, setIsEnabled] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Use ref to store throttled function to avoid recreating it
  const throttledHandleMouseMoveRef = useRef<((event: MouseEvent) => void) | null>(null);

  useEffect(() => {
    // Disable on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setIsEnabled(false);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      // Calculate position relative to center (-1 to 1)
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      // Apply strength multiplier
      mouseX.set(x * strength);
      mouseY.set(y * strength);
    };

    // Create throttled version
    throttledHandleMouseMoveRef.current = throttle(handleMouseMove, throttleMs);

    window.addEventListener('mousemove', throttledHandleMouseMoveRef.current);

    return () => {
      if (throttledHandleMouseMoveRef.current) {
        window.removeEventListener('mousemove', throttledHandleMouseMoveRef.current);
      }
    };
  }, [strength, mouseX, mouseY, throttleMs]);

  return {
    x: isEnabled ? springX : 0,
    y: isEnabled ? springY : 0,
    isEnabled,
  };
};

/**
 * useParallaxLayer Hook
 * 
 * Creates layered parallax effect with different depths.
 * 
 * @param depth - Layer depth (0-1, where 1 is furthest)
 * @returns Transform values for the layer
 * 
 * @example
 * const layer1 = useParallaxLayer(0.2);
 * const layer2 = useParallaxLayer(0.5);
 * const layer3 = useParallaxLayer(0.8);
 */
export const useParallaxLayer = (depth: number = 0.5) => {
  const strength = depth * 40; // Scale depth to parallax strength
  return useParallax({ strength });
};

/**
 * useScrollParallax Hook
 * 
 * Creates parallax effect based on scroll position.
 * 
 * @param speed - Scroll speed multiplier (default: 0.5)
 * @param throttleMs - Throttle interval in milliseconds (default: 16)
 * @returns Transform Y value
 * 
 * @example
 * const y = useScrollParallax(0.3);
 * 
 * <motion.div style={{ y }}>
 *   Scroll parallax content
 * </motion.div>
 */
export const useScrollParallax = (speed: number = 0.5, throttleMs: number = 16) => {
  const scrollY = useMotionValue(0);
  const y = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const throttledHandleScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY * speed);
    };

    // Create throttled version
    throttledHandleScrollRef.current = throttle(handleScroll, throttleMs);

    window.addEventListener('scroll', throttledHandleScrollRef.current, { passive: true });

    return () => {
      if (throttledHandleScrollRef.current) {
        window.removeEventListener('scroll', throttledHandleScrollRef.current);
      }
    };
  }, [speed, scrollY, throttleMs]);

  return y;
};
