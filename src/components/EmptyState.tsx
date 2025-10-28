import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from './index';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div 
      className="text-center py-12"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? undefined : staggerChildren}
    >
      {icon && (
        <motion.div 
          className="flex justify-center mb-4"
          variants={prefersReducedMotion ? undefined : fadeInUp}
          animate={!prefersReducedMotion ? {
            y: [0, -8, 0],
            transition: {
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut'
            }
          } : {}}
        >
          {icon}
        </motion.div>
      )}
      <motion.h3 
        className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        {description}
      </motion.p>
      {actionLabel && onAction && (
        <motion.div variants={prefersReducedMotion ? undefined : fadeInUp}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
