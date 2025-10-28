/**
 * use3DTransform Hook
 * 
 * Creates 3D transform effects for cards based on mouse position.
 * Provides tilt and perspective effects for interactive elements.
 * 
 * @param maxRotation - Maximum rotation in degrees (default: 10)
 * @returns Transform values and event handlers
 * 
 * @example
 * const { transform, handleMouseMove, handleMouseLeave } = use3DTransform();
 * 
 * <motion.div
 *   style={{ transform }}
 *   onMouseMove={handleMouseMove}
 *   onMouseLeave={handleMouseLeave}
 * >
 *   3D Card
 * </motion.div>
 */

import { useState, useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { throttle } from '../utils/performance';

interface Use3DTransformOptions {
  maxRotation?: number;
  perspective?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
  throttleMs?: number;
}

export const use3DTransform = (options: Use3DTransformOptions = {}) => {
  const {
    maxRotation = 10,
    perspective = 1000,
    springConfig = { stiffness: 300, damping: 30 },
    throttleMs = 16, // ~60fps
  } = options;

  const [isHovering, setIsHovering] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const throttledUpdateRef = useRef<((x: number, y: number) => void) | null>(null);

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxRotation, -maxRotation]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxRotation, maxRotation]),
    springConfig
  );

  // Create throttled update function
  if (!throttledUpdateRef.current) {
    throttledUpdateRef.current = throttle((x: number, y: number) => {
      mouseX.set(x);
      mouseY.set(y);
    }, throttleMs);
  }

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!elementRef.current) {
        elementRef.current = event.currentTarget;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      // Use throttled update
      if (throttledUpdateRef.current) {
        throttledUpdateRef.current(x, y);
      }
      setIsHovering(true);
    },
    [mouseX, mouseY]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovering(false);
  }, [mouseX, mouseY]);

  // Transform string
  const transform = useTransform(
    [rotateX, rotateY],
    ([x, y]) => `perspective(${perspective}px) rotateX(${x}deg) rotateY(${y}deg)`
  );

  return {
    transform,
    rotateX,
    rotateY,
    isHovering,
    handleMouseMove,
    handleMouseLeave,
  };
};

/**
 * use3DCardHover Hook
 * 
 * Simplified version for card hover effects with lift.
 * 
 * @returns Transform values and event handlers
 * 
 * @example
 * const cardProps = use3DCardHover();
 * 
 * <motion.div {...cardProps}>
 *   Card content
 * </motion.div>
 */
export const use3DCardHover = () => {
  const { transform, handleMouseMove, handleMouseLeave, isHovering } = use3DTransform({
    maxRotation: 5,
    perspective: 1000,
  });

  const scale = useSpring(isHovering ? 1.02 : 1, {
    stiffness: 300,
    damping: 30,
  });

  return {
    style: { transform, scale },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileHover: { y: -4 },
  };
};

/**
 * useGlowEffect Hook
 * 
 * Creates a glow effect that follows the mouse cursor.
 * 
 * @param throttleMs - Throttle interval in milliseconds (default: 16)
 * @returns Glow position and event handlers
 * 
 * @example
 * const { glowX, glowY, handleMouseMove, handleMouseLeave } = useGlowEffect();
 * 
 * <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
 *   <div
 *     style={{
 *       background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(107, 142, 35, 0.3), transparent)`,
 *     }}
 *   />
 * </div>
 */
export const useGlowEffect = (throttleMs: number = 16) => {
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = useState(false);
  const throttledUpdateRef = useRef<((x: number, y: number) => void) | null>(null);

  // Create throttled update function
  if (!throttledUpdateRef.current) {
    throttledUpdateRef.current = throttle((x: number, y: number) => {
      setGlowPosition({ x, y });
    }, throttleMs);
  }

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (throttledUpdateRef.current) {
      throttledUpdateRef.current(x, y);
    }
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    glowX: glowPosition.x,
    glowY: glowPosition.y,
    isActive,
    handleMouseMove,
    handleMouseLeave,
  };
};
