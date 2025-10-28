import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  // Detect mobile for different animation
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const modalVariants = {
    hidden: isMobile
      ? { y: '100%', opacity: 0 }
      : { scale: 0.95, opacity: 0 },
    visible: isMobile
      ? { y: 0, opacity: 1 }
      : { scale: 1, opacity: 1 },
    exit: isMobile
      ? { y: '100%', opacity: 0 }
      : { scale: 0.95, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Glass backdrop with blur overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full ${sizeClasses[size]}`}
              onClick={(e) => e.stopPropagation()}
              variants={prefersReducedMotion ? {} : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={springConfig}
              style={{
                boxShadow: '0 0 40px rgba(107, 142, 35, 0.2)',
              }}
            >
              {/* Ambient glow around edges (sage color) */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(107, 142, 35, 0.1)',
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 text-gray-100">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
