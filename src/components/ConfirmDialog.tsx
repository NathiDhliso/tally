import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './index';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) => {
  const prefersReducedMotion = useReducedMotion();

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400';
      case 'warning':
        return 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400';
      case 'info':
        return 'bg-info-100 dark:bg-info-900 text-info-600 dark:text-info-400';
    }
  };

  const getIcon = () => {
    const iconVariants = {
      hidden: { scale: 0, rotate: -180 },
      visible: { 
        scale: 1, 
        rotate: 0,
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
      },
    };

    const shakeVariant = variant === 'danger' ? {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, delay: 0.3 }
    } : {};

    switch (variant) {
      case 'danger':
        return (
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            variants={prefersReducedMotion ? {} : iconVariants}
            initial="hidden"
            animate="visible"
            whileHover={!prefersReducedMotion ? shakeVariant : {}}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </motion.svg>
        );
      case 'warning':
        return (
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            variants={prefersReducedMotion ? {} : iconVariants}
            initial="hidden"
            animate="visible"
            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </motion.svg>
        );
      case 'info':
        return (
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            variants={prefersReducedMotion ? {} : iconVariants}
            initial="hidden"
            animate="visible"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25,
                duration: prefersReducedMotion ? 0 : undefined
              }}
            >
              {/* Icon */}
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${getIconColor()}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 20,
                  delay: 0.1 
                }}
              >
                {getIcon()}
              </motion.div>

              {/* Title */}
              <motion.h2 
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>

              {/* Actions */}
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === 'danger' ? 'primary' : 'primary'}
                  size="lg"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1"
                >
                  {confirmLabel}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
