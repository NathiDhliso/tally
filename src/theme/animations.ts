/**
 * Aloe Design System - Animation Presets
 * 
 * CSS-based animation utilities and presets for the Aloe design system.
 * These complement the Framer Motion utilities in src/utils/animations.ts
 */

/**
 * Easing functions for smooth animations
 */
export const easings = {
  // Standard easings
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Custom easings for Aloe design
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy spring effect
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Gentle ease
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)', // Sharp transition
} as const;

/**
 * Animation durations in milliseconds
 */
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
  
  // Aloe-specific durations
  breathing: 3000, // 3s breathing cycle
  pulse: 2000, // 2s pulse cycle
  shimmer: 2000, // 2s shimmer cycle
  bloom: 800, // 0.8s bloom animation
  ripple: 1500, // 1.5s ripple effect
  float: 6000, // 6s float cycle
} as const;

/**
 * Tailwind animation class names
 * These correspond to animations defined in tailwind.config.js and index.css
 */
export const animationClasses = {
  // Standard animations
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  ping: 'animate-ping',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Aloe design system animations
  breathing: 'animate-breathing',
  shimmer: 'animate-shimmer',
  glowPulse: 'animate-glow-pulse',
  geometricRipple: 'animate-geometric-ripple',
  bloom: 'animate-bloom',
  float: 'animate-float',
  typing: 'animate-typing',
} as const;

/**
 * CSS animation definitions
 * Use these for inline styles or dynamic animations
 */
export const cssAnimations = {
  breathing: {
    animation: 'breathing 3s ease-in-out infinite',
  },
  shimmer: {
    animation: 'shimmer 2s linear infinite',
  },
  glowPulse: {
    animation: 'glow-pulse 2s ease-in-out infinite',
  },
  geometricRipple: {
    animation: 'geometric-ripple 1.5s ease-out infinite',
  },
  bloom: {
    animation: 'bloom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  },
  float: {
    animation: 'float 6s ease-in-out infinite',
  },
  typing: {
    animation: 'typing 0.05s linear',
  },
} as const;

/**
 * Transition presets for common use cases
 */
export const transitions = {
  // Standard transitions
  all: {
    fast: 'transition-all duration-200 ease-smooth',
    normal: 'transition-all duration-300 ease-smooth',
    slow: 'transition-all duration-500 ease-smooth',
  },
  
  // Specific property transitions
  colors: {
    fast: 'transition-colors duration-200 ease-smooth',
    normal: 'transition-colors duration-300 ease-smooth',
    slow: 'transition-colors duration-500 ease-smooth',
  },
  
  opacity: {
    fast: 'transition-opacity duration-200 ease-smooth',
    normal: 'transition-opacity duration-300 ease-smooth',
    slow: 'transition-opacity duration-500 ease-smooth',
  },
  
  transform: {
    fast: 'transition-transform duration-200 ease-smooth',
    normal: 'transition-transform duration-300 ease-smooth',
    slow: 'transition-transform duration-500 ease-smooth',
  },
  
  shadow: {
    fast: 'transition-shadow duration-200 ease-smooth',
    normal: 'transition-shadow duration-300 ease-smooth',
    slow: 'transition-shadow duration-500 ease-smooth',
  },
  
  // Combined transitions for common patterns
  glass: 'transition-all duration-300 ease-smooth', // For glassmorphic elements
  button: 'transition-all duration-200 ease-smooth', // For interactive buttons
  card: 'transition-all duration-300 ease-smooth', // For card hover effects
  modal: 'transition-all duration-300 ease-smooth', // For modal animations
} as const;

/**
 * Stagger delays for sequential animations
 * Use with Framer Motion's staggerChildren or CSS animation-delay
 */
export const staggerDelays = {
  fast: 50, // 50ms between items
  normal: 100, // 100ms between items
  slow: 150, // 150ms between items
  
  // Aloe-specific staggers
  petalBloom: 50, // For AloeBloom petal animations
  fieldReveal: 100, // For form field reveals
  listItems: 75, // For list item animations
} as const;

/**
 * Animation state classes
 * Use these to apply animation states conditionally
 */
export const animationStates = {
  // Hover states
  hoverScale: 'hover:scale-105',
  hoverLift: 'hover:-translate-y-1',
  hoverGlow: 'hover:shadow-glow-sage',
  hoverBrightness: 'hover:brightness-110',
  
  // Active/pressed states
  activeScale: 'active:scale-98',
  activePress: 'active:translate-y-0.5',
  
  // Focus states
  focusRing: 'focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
  focusGlow: 'focus:shadow-glow-sage',
  
  // Disabled states
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

/**
 * Performance optimization hints
 * Use these classes to optimize animation performance
 */
export const performanceHints = {
  willChange: {
    transform: 'will-change-transform',
    opacity: 'will-change-opacity',
    auto: 'will-change-auto',
  },
  
  // GPU acceleration
  gpu: 'transform-gpu',
  
  // Reduce motion support
  reduceMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
} as const;

/**
 * Helper function to combine animation classes
 */
export const combineAnimations = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Helper function to get animation with reduced motion support
 */
export const getAccessibleAnimation = (
  animationClass: string,
  fallbackClass: string = ''
): string => {
  return `${animationClass} ${performanceHints.reduceMotion} ${fallbackClass}`.trim();
};

/**
 * Preset animation combinations for common use cases
 */
export const animationPresets = {
  // Button animations
  button: combineAnimations(
    transitions.button,
    animationStates.hoverScale,
    animationStates.activeScale,
    performanceHints.gpu
  ),
  
  // Card animations
  card: combineAnimations(
    transitions.card,
    animationStates.hoverLift,
    animationStates.hoverGlow,
    performanceHints.gpu
  ),
  
  // Glass surface animations
  glass: combineAnimations(
    transitions.glass,
    performanceHints.gpu
  ),
  
  // Modal animations
  modal: combineAnimations(
    transitions.modal,
    performanceHints.willChange.opacity,
    performanceHints.willChange.transform
  ),
  
  // Input field animations
  input: combineAnimations(
    transitions.colors.normal,
    animationStates.focusRing,
    performanceHints.gpu
  ),
  
  // Icon animations
  icon: combineAnimations(
    transitions.transform.fast,
    performanceHints.gpu
  ),
} as const;

/**
 * Keyframe animation definitions (for reference)
 * These are defined in src/index.css and tailwind.config.js
 */
export const keyframeReference = {
  breathing: '@keyframes breathing { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }',
  shimmer: '@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }',
  glowPulse: '@keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(107, 142, 35, 0.3); } 50% { box-shadow: 0 0 40px rgba(218, 165, 32, 0.6); } }',
  geometricRipple: '@keyframes geometric-ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }',
  bloom: '@keyframes bloom { 0% { transform: scale(0) rotate(-45deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }',
  float: '@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }',
  typing: '@keyframes typing { from { width: 0; } to { width: 100%; } }',
} as const;
