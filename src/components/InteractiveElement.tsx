/**
 * InteractiveElement Component
 * A wrapper component that adds consistent micro-interactions to any element
 */

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  buttonPress,
  buttonHover,
  cardHover,
  iconHoverScale,
  TIMING,
  getHoverShadow,
} from '../utils/microInteractions';

type InteractionType = 'button' | 'card' | 'icon' | 'link' | 'none';

interface InteractiveElementProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  type?: InteractionType;
  glowColor?: 'sage' | 'terracotta' | 'gold' | 'white';
  disabled?: boolean;
  className?: string;
}

export const InteractiveElement = ({
  children,
  type = 'button',
  glowColor = 'sage',
  disabled = false,
  className = '',
  ...props
}: InteractiveElementProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Don't apply animations if reduced motion is preferred or element is disabled
  const shouldAnimate = !prefersReducedMotion && !disabled;

  // Get interaction config based on type
  const getInteractionConfig = () => {
    if (!shouldAnimate || type === 'none') {
      return { whileHover: {}, whileTap: {} };
    }

    switch (type) {
      case 'button':
        return {
          whileHover: { ...buttonHover, boxShadow: getHoverShadow(glowColor) },
          whileTap: buttonPress,
        };
      case 'card':
        return {
          whileHover: { ...cardHover, boxShadow: getHoverShadow(glowColor) },
          whileTap: { scale: 0.99 },
        };
      case 'icon':
        return {
          whileHover: iconHoverScale,
          whileTap: { scale: 0.95 },
        };
      case 'link':
        return {
          whileHover: { x: 2 },
          whileTap: { scale: 0.98 },
        };
      default:
        return { whileHover: {}, whileTap: {} };
    }
  };

  const interactionConfig = getInteractionConfig();

  return (
    <motion.div
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      transition={{ duration: TIMING.fast }}
      {...interactionConfig}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default InteractiveElement;
