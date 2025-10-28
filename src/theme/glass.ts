/**
 * Aloe Design System - Glassmorphism Utilities
 * 
 * This module provides glassmorphism styles and utilities for creating
 * modern, futuristic glass surfaces with backdrop blur effects.
 * 
 * Usage:
 * - Use glassStyles for inline style objects
 * - Use glassClasses for Tailwind utility classes
 * - Combine with Aloe colors for sage-tinted glass effects
 */

import type { CSSProperties } from 'react';

/**
 * Base glassmorphism style objects for inline styles
 */
export const glassStyles = {
  /**
   * Base glass surface
   * Use for standard glass components
   */
  base: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // Safari support
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as CSSProperties,

  /**
   * Glass surface on hover
   * Slightly more opaque for interactive feedback
   */
  hover: {
    background: 'rgba(255, 255, 255, 0.15)',
  } as CSSProperties,

  /**
   * Glass card surface
   * For card components with subtle depth
   */
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  } as CSSProperties,

  /**
   * Glass button surface
   * Optimized for interactive elements
   */
  button: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as CSSProperties,

  /**
   * Glass modal surface
   * Higher blur for overlay modals
   */
  modal: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } as CSSProperties,
};

/**
 * Tailwind utility class strings for glassmorphism
 * Use these for className props
 */
export const glassClasses = {
  /**
   * Base glass surface classes
   * Example: <div className={glassClasses.base}>
   */
  base: 'bg-white/10 backdrop-blur-xl border border-white/20',

  /**
   * Glass surface with hover effect
   * Example: <button className={`${glassClasses.base} ${glassClasses.hover}`}>
   */
  hover: 'hover:bg-white/15 transition-colors duration-200',

  /**
   * Glass card with shadow
   * Example: <div className={glassClasses.card}>
   */
  card: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg',

  /**
   * Glass card with hover lift effect
   * Example: <div className={`${glassClasses.card} ${glassClasses.cardHover}`}>
   */
  cardHover: 'hover:bg-white/15 hover:shadow-xl hover:-translate-y-1 transition-all duration-300',

  /**
   * Glass button surface
   * Example: <button className={glassClasses.button}>
   */
  button: 'bg-white/10 backdrop-blur-md border border-white/20',

  /**
   * Glass button with hover effect
   * Example: <button className={`${glassClasses.button} ${glassClasses.buttonHover}`}>
   */
  buttonHover: 'hover:bg-white/15 hover:shadow-glow transition-all duration-200',

  /**
   * Glass modal backdrop
   * Example: <div className={glassClasses.modalBackdrop}>
   */
  modalBackdrop: 'bg-black/50 backdrop-blur-sm',

  /**
   * Glass modal surface
   * Example: <div className={glassClasses.modal}>
   */
  modal: 'bg-white/5 backdrop-blur-2xl border border-white/10',

  /**
   * Sage-tinted glass (for Aloe theme)
   * Example: <div className={glassClasses.sageTinted}>
   */
  sageTinted: 'bg-sage-500/10 backdrop-blur-xl border border-sage-500/20',

  /**
   * Combined base + hover for convenience
   * Example: <button className={glassClasses.interactive}>
   */
  interactive: 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-colors duration-200',
};

/**
 * Helper function to combine glass classes
 * @param variant - The glass variant to use
 * @param withHover - Whether to include hover effects
 * @param additionalClasses - Additional Tailwind classes
 * @returns Combined class string
 */
export const getGlassClasses = (
  variant: 'base' | 'card' | 'button' | 'modal' = 'base',
  withHover: boolean = false,
  additionalClasses: string = ''
): string => {
  const baseClass = glassClasses[variant];
  const hoverClass = withHover ? glassClasses[`${variant}Hover` as keyof typeof glassClasses] || glassClasses.hover : '';
  
  return [baseClass, hoverClass, additionalClasses].filter(Boolean).join(' ');
};

/**
 * Fallback styles for browsers that don't support backdrop-filter
 * Use with @supports CSS feature query
 */
export const glassFallback = {
  base: {
    background: 'rgba(255, 255, 255, 0.2)',
  } as CSSProperties,
  
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  } as CSSProperties,
  
  modal: {
    background: 'rgba(255, 255, 255, 0.15)',
  } as CSSProperties,
};

/**
 * Check if backdrop-filter is supported
 * @returns true if backdrop-filter is supported
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
};
