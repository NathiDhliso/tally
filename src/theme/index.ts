/**
 * Aloe Design System - Main Theme Export
 * 
 * This is the central export point for the Aloe design system.
 * Import theme utilities from here for consistent styling across the app.
 */

// Import Aloe design system modules
import { futuristicColors, semanticColors, gradients } from './colors';
import { 
  glassStyles, 
  glassClasses, 
  getGlassClasses,
  glassFallback,
  supportsBackdropFilter
} from './glass';
import { 
  easings, 
  durations, 
  animationClasses, 
  cssAnimations, 
  transitions, 
  staggerDelays,
  animationStates,
  performanceHints,
  animationPresets,
  combineAnimations,
  getAccessibleAnimation,
  keyframeReference
} from './animations';

// Re-export all modules
export {
  // Colors
  futuristicColors,
  semanticColors,
  gradients,
  
  // Glass
  glassStyles,
  glassClasses,
  getGlassClasses,
  glassFallback,
  supportsBackdropFilter,
  
  // Animations
  easings,
  durations,
  animationClasses,
  cssAnimations,
  transitions,
  staggerDelays,
  animationStates,
  performanceHints,
  animationPresets,
  combineAnimations,
  getAccessibleAnimation,
  keyframeReference,
};

// Legacy color mappings for backward compatibility
export const colors = {
  primary: {
    main: 'primary-500',
    light: 'primary-100',
    dark: 'primary-700',
    hover: 'primary-600',
  },
  secondary: {
    main: 'secondary-500',
    light: 'secondary-100',
    dark: 'secondary-700',
    hover: 'secondary-600',
  },
  success: {
    main: 'success-500',
    light: 'success-50',
    dark: 'success-700',
  },
  warning: {
    main: 'warning-500',
    light: 'warning-50',
    dark: 'warning-700',
  },
  error: {
    main: 'error-500',
    light: 'error-50',
    dark: 'error-700',
  },
  info: {
    main: 'info-500',
    light: 'info-50',
    dark: 'info-700',
  },
  neutral: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    300: 'gray-300',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    800: 'gray-800',
    900: 'gray-900',
  },
  // New Aloe colors
  sage: {
    main: 'sage-500',
    light: 'sage-100',
    dark: 'sage-700',
    hover: 'sage-600',
  },
  terracotta: {
    main: 'terracotta-500',
    light: 'terracotta-100',
    dark: 'terracotta-700',
    hover: 'terracotta-600',
  },
  gold: {
    main: 'gold-500',
    light: 'gold-100',
    dark: 'gold-700',
    hover: 'gold-600',
  },
  space: {
    darkest: 'space-darkest',
    dark: 'space-dark',
    medium: 'space-medium',
    light: 'space-light',
  },
};

export const spacing = {
  touch: {
    min: 'min-h-touch min-w-touch', // 44px minimum for touch targets
  },
};

// Legacy animation mappings
export const animations = {
  slideUp: 'animate-slide-up',
  fadeIn: 'animate-fade-in',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  ping: 'animate-ping',
  // New Aloe animations
  breathing: 'animate-breathing',
  shimmer: 'animate-shimmer',
  glowPulse: 'animate-glow-pulse',
  geometricRipple: 'animate-geometric-ripple',
  bloom: 'animate-bloom',
  float: 'animate-float',
};

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  // New Aloe shadows
  glowSage: 'shadow-glow-sage',
  glowSageLg: 'shadow-glow-sage-lg',
  glowGold: 'shadow-glow-gold',
  glowGoldLg: 'shadow-glow-gold-lg',
  glowTerracotta: 'shadow-glow-terracotta',
  glowTerracottaLg: 'shadow-glow-terracotta-lg',
  innerGlow: 'shadow-inner-glow',
  lift: 'shadow-lift',
  glass: 'shadow-glass',
};

export const borderRadius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '4xl': 'rounded-4xl',
  full: 'rounded-full',
};
