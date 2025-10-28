/**
 * Tooltip Component
 * Provides contextual information on hover with smooth animations
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { tooltipVariants } from '../utils/microInteractions';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
            variants={prefersReducedMotion ? undefined : tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-white/10 whitespace-nowrap">
              {content}
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900/95 border-white/10 transform rotate-45 ${
                  position === 'top'
                    ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r'
                    : position === 'bottom'
                      ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l'
                      : position === 'left'
                        ? 'right-[-4px] top-1/2 -translate-y-1/2 border-r border-t'
                        : 'left-[-4px] top-1/2 -translate-y-1/2 border-l border-b'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
