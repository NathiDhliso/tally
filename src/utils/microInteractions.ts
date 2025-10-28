/**
 * Micro-interactions utility
 * Provides consistent micro-interaction patterns across the app
 */

import { type Variants } from 'framer-motion';

/**
 * Standard timing values for consistent animations
 */
export const TIMING = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

/**
 * Standard easing functions
 */
export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: { type: 'spring' as const, stiffness: 400, damping: 25 },
  gentleSpring: { type: 'spring' as const, stiffness: 300, damping: 30 },
} as const;

/**
 * Button press feedback - subtle scale down
 */
export const buttonPress = {
  scale: 0.98,
  transition: EASING.spring,
};

/**
 * Button hover feedback - subtle scale up with glow
 */
export const buttonHover = {
  scale: 1.02,
  transition: EASING.spring,
};

/**
 * Card hover lift effect
 */
export const cardHover = {
  y: -4,
  transition: EASING.gentleSpring,
};

/**
 * Icon hover rotation
 */
export const iconHover = {
  rotate: [0, -5, 5, 0],
  transition: { duration: TIMING.normal },
};

/**
 * Icon hover scale
 */
export const iconHoverScale = {
  scale: 1.1,
  transition: EASING.spring,
};

/**
 * Ripple effect for touch feedback
 */
export const rippleVariants: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Pulse animation for notifications/badges
 */
export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/**
 * Shake animation for errors
 */
export const shakeVariants: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};

/**
 * Glow pulse for low confidence indicators
 */
export const glowPulseVariants: Variants = {
  initial: { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' },
  animate: {
    boxShadow: [
      '0 0 10px rgba(245, 158, 11, 0.3)',
      '0 0 20px rgba(245, 158, 11, 0.6)',
      '0 0 10px rgba(245, 158, 11, 0.3)',
    ],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/**
 * Sparkle effect for high confidence
 */
export const sparkleVariants: Variants = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: {
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

/**
 * Loading shimmer effect
 */
export const shimmerVariants: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '200%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};

/**
 * Floating animation for decorative elements
 */
export const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Breathing animation for idle states
 */
export const breathingVariants: Variants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/**
 * Success checkmark draw animation
 */
export const checkmarkVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * Error X draw animation
 */
export const errorXVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * Tooltip fade in
 */
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 5, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: TIMING.fast, ease: 'easeOut' },
  },
};

/**
 * Badge entrance animation
 */
export const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: EASING.spring,
  },
};

/**
 * Stagger delay calculator
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05): number => {
  return index * baseDelay;
};

/**
 * Get hover shadow based on color
 */
export const getHoverShadow = (color: 'sage' | 'terracotta' | 'gold' | 'white'): string => {
  const shadows = {
    sage: '0 0 20px rgba(107, 142, 35, 0.4)',
    terracotta: '0 0 20px rgba(210, 105, 30, 0.4)',
    gold: '0 0 20px rgba(218, 165, 32, 0.4)',
    white: '0 0 20px rgba(255, 255, 255, 0.2)',
  };
  return shadows[color];
};

/**
 * Get active shadow based on color
 */
export const getActiveShadow = (color: 'sage' | 'terracotta' | 'gold' | 'white'): string => {
  const shadows = {
    sage: '0 0 30px rgba(107, 142, 35, 0.6)',
    terracotta: '0 0 30px rgba(210, 105, 30, 0.6)',
    gold: '0 0 30px rgba(218, 165, 32, 0.6)',
    white: '0 0 30px rgba(255, 255, 255, 0.3)',
  };
  return shadows[color];
};
