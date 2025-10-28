/**
 * Aloe Design System - Color Palette
 * 
 * This color system is inspired by the Aloe plant, native to South Africa,
 * symbolizing resilience, stability, and financial wellness.
 * 
 * Color Usage Guide:
 * - Sage: Primary actions, stability, trust
 * - Terracotta: Success states, reserves, warmth
 * - Gold: Highlights, success accents, premium feel
 * - Space: Deep backgrounds for futuristic aesthetic
 * - Glass: Glassmorphism effects with transparency
 */

export const futuristicColors = {
  // Deep Space Backgrounds - For futuristic, immersive feel
  space: {
    darkest: '#0a0a0f',
    dark: '#0f172a',
    medium: '#1e293b',
    light: '#334155',
  },
  
  // Sage/Olive Green - Stability, Primary Actions
  // Represents the resilient Aloe plant
  sage: {
    50: '#f6f8f4',
    100: '#e8ede3',
    200: '#d1dbc7',
    300: '#b5c9a5',
    400: '#8ba888',
    500: '#6b8e23', // Primary sage
    600: '#5a7a1e',
    700: '#4a6619',
    800: '#3a5214',
    900: '#2a3e0f',
  },
  
  // Terracotta/Warm - Success, Reserves
  // Represents the warm earth and deep reserves
  terracotta: {
    50: '#fef6f0',
    100: '#fde9d9',
    200: '#fbd3b3',
    300: '#f0b68c',
    400: '#e8a87c',
    500: '#d2691e', // Primary terracotta
    600: '#b8591a',
    700: '#9e4a16',
    800: '#843b12',
    900: '#6a2c0e',
  },
  
  // Warm Gold - Highlights, Success Accents
  // Represents premium quality and achievement
  gold: {
    50: '#fefbf3',
    100: '#fdf5e0',
    200: '#faecc1',
    300: '#f7e29f',
    400: '#f4d03f',
    500: '#daa520', // Primary gold
    600: '#c19420',
    700: '#a8831c',
    800: '#8f7218',
    900: '#766114',
  },
  
  // Glassmorphism - For glass surfaces and overlays
  glass: {
    white: 'rgba(255, 255, 255, 0.1)',
    whiteHover: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
    sage: 'rgba(107, 142, 35, 0.1)', // Sage-tinted glass
  },
};

// Semantic color mappings for easy usage
export const semanticColors = {
  primary: futuristicColors.sage[500],
  primaryHover: futuristicColors.sage[600],
  success: futuristicColors.terracotta[500],
  successHover: futuristicColors.terracotta[600],
  accent: futuristicColors.gold[500],
  accentHover: futuristicColors.gold[600],
  background: futuristicColors.space.dark,
  backgroundDarkest: futuristicColors.space.darkest,
};

// Gradient presets for common use cases
export const gradients = {
  sageGold: 'linear-gradient(135deg, #6b8e23, #daa520)',
  terracottaGold: 'linear-gradient(135deg, #d2691e, #daa520)',
  sageToTerracotta: 'linear-gradient(135deg, #6b8e23, #d2691e)',
  spaceDepth: 'linear-gradient(180deg, #0a0a0f, #0f172a)',
};
