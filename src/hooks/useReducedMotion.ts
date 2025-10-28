/**
 * useReducedMotion Hook
 * 
 * Detects if the user has requested reduced motion via their OS settings.
 * Use this to conditionally disable or simplify animations for accessibility.
 * 
 * @returns {boolean} - True if user prefers reduced motion
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: 1.1 }}
 * />
 */

import { useState, useEffect } from 'react';

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Helper function to get animation duration based on reduced motion preference
 * 
 * @param normalDuration - Duration in milliseconds for normal motion
 * @param reducedDuration - Duration in milliseconds for reduced motion (default: 0)
 * @returns Duration to use
 */
export const getAnimationDuration = (
  normalDuration: number,
  reducedDuration: number = 0
): number => {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion ? reducedDuration : normalDuration;
};

/**
 * Helper function to conditionally apply animation variants
 * 
 * @param variants - Animation variants object
 * @param fallback - Fallback variants for reduced motion (default: empty object)
 * @returns Variants to use
 */
export const getAnimationVariants = <T extends Record<string, any>>(
  variants: T,
  fallback: Partial<T> = {}
): T | Partial<T> => {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion ? fallback : variants;
};
