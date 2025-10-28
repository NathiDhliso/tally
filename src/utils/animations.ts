/**
 * Framer Motion Animation Utilities
 * 
 * Centralized animation configurations for Framer Motion.
 * Provides variants, spring configs, and gesture handlers.
 */

import type { Variants, Transition } from 'framer-motion';

// Spring configuration presets
export const springConfig: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: smoothTransition 
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: springConfig 
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: springConfig 
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: springConfig 
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: bouncySpring 
  },
};

// Glow pulse animation
export const glowPulse: Variants = {
  idle: { 
    boxShadow: '0 0 20px rgba(107, 142, 35, 0.3)' 
  },
  active: { 
    boxShadow: [
      '0 0 20px rgba(107, 142, 35, 0.3)',
      '0 0 40px rgba(218, 165, 32, 0.6)',
      '0 0 20px rgba(107, 142, 35, 0.3)',
    ],
    transition: { 
      repeat: Infinity, 
      duration: 2, 
      ease: 'easeInOut' 
    }
  },
};

// Shimmer animation for loading states
export const shimmer: Variants = {
  initial: { 
    backgroundPosition: '-200% 0' 
  },
  animate: { 
    backgroundPosition: '200% 0',
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    }
  },
};

// Bloom animation for success states
export const bloom: Variants = {
  hidden: { 
    scale: 0, 
    rotate: -45, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.8,
    }
  },
};

// Stagger children animation
export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerChildrenFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: springConfig 
  },
  exit: { 
    y: '100%', 
    opacity: 0, 
    transition: smoothTransition 
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: springConfig 
  },
  exit: { 
    x: '100%', 
    opacity: 0, 
    transition: smoothTransition 
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: springConfig 
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: smoothTransition 
  },
};

// Hover and tap animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 },
  transition: smoothTransition,
};

export const hoverLift = {
  whileHover: { 
    y: -4, 
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' 
  },
  transition: smoothTransition,
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 40px rgba(107, 142, 35, 0.6)' 
  },
  transition: smoothTransition,
};

// Gesture configurations
export const dragConstraints = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

// Typing effect utility (for use with custom hook)
export const typingTransition: Transition = {
  duration: 0.05,
  ease: 'linear',
};

// Breathing animation for idle states
export const breathing: Variants = {
  idle: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  },
};

// Geometric ripple for Aloe design
export const geometricRipple: Variants = {
  initial: { 
    scale: 1, 
    opacity: 0.6 
  },
  animate: { 
    scale: 2, 
    opacity: 0,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeOut',
    }
  },
};

// Float animation for decorative elements
export const float: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      repeat: Infinity,
      duration: 6,
      ease: 'easeInOut',
    },
  },
};

// Performance hints for will-change
export const performanceHints = {
  // Use these as inline styles for elements that will animate
  willChange: {
    transform: { willChange: 'transform' as const },
    opacity: { willChange: 'opacity' as const },
    transformOpacity: { willChange: 'transform, opacity' as const },
    transformShadow: { willChange: 'transform, box-shadow' as const },
    auto: { willChange: 'auto' as const },
  },
  // Tailwind classes for will-change
  classes: {
    transform: 'will-change-transform',
    opacity: 'will-change-opacity',
    auto: 'will-change-auto',
  },
};

/**
 * Get appropriate will-change value based on animation state and device performance
 * 
 * @param isAnimating - Whether the element is currently animating
 * @param properties - CSS properties that will change (e.g., 'transform', 'opacity')
 * @param isLowEnd - Whether the device is low-end (optional, auto-detected if not provided)
 * @returns will-change value or 'auto'
 */
export const getWillChange = (
  isAnimating: boolean,
  properties: string[] = ['transform'],
  isLowEnd?: boolean
): string => {
  // Don't use will-change on low-end devices
  const lowEnd = isLowEnd ?? (
    typeof navigator !== 'undefined' && 
    navigator.hardwareConcurrency && 
    navigator.hardwareConcurrency < 4
  );
  
  if (lowEnd || !isAnimating) {
    return 'auto';
  }
  
  return properties.join(', ');
};
