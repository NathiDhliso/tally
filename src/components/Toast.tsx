import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, type, message, duration = 5000, onClose }: ToastProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    // Progress bar animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 16); // ~60fps

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [id, duration, onClose]);

  const getIcon = () => {
    const iconVariants = {
      hidden: { scale: 0, rotate: -180 },
      visible: { scale: 1, rotate: 0 },
    };

    const errorShake = {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    };

    switch (type) {
      case 'success':
        return (
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            variants={prefersReducedMotion ? {} : iconVariants}
            initial="hidden"
            animate="visible"
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
            <motion.path
              d="M9 12l2 2 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: 'easeInOut' }}
            />
          </motion.svg>
        );
      case 'error':
        return (
          <motion.svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={prefersReducedMotion ? {} : errorShake}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </motion.svg>
        );
      case 'warning':
        return (
          <motion.svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </motion.svg>
        );
      case 'info':
        return (
          <motion.svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            variants={prefersReducedMotion ? {} : iconVariants}
            initial="hidden"
            animate="visible"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </motion.svg>
        );
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-sage-500/10',
          border: 'border-sage-500/30',
          text: 'text-sage-200',
          iconColor: 'text-sage-400',
          progress: 'from-sage-500 to-gold-500',
          glow: 'shadow-sage-500/20',
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-200',
          iconColor: 'text-red-400',
          progress: 'from-red-500 to-orange-500',
          glow: 'shadow-red-500/20',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-200',
          iconColor: 'text-amber-400',
          progress: 'from-amber-500 to-orange-500',
          glow: 'shadow-amber-500/20',
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-200',
          iconColor: 'text-blue-400',
          progress: 'from-blue-500 to-cyan-500',
          glow: 'shadow-blue-500/20',
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-center gap-3 p-4 rounded-xl backdrop-blur-xl border ${colors.bg} ${colors.border} ${colors.text} shadow-lg ${colors.glow} overflow-hidden min-w-[320px]`}
      role="alert"
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Progress bar with shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.progress} relative overflow-hidden`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* Enhanced shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              backgroundSize: '200% 100%',
            }}
            animate={{ 
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'linear' 
            }}
          />
        </motion.div>
      </div>

      <div className={`flex-shrink-0 ${colors.iconColor}`}>{getIcon()}</div>
      <p className="flex-1 text-sm font-medium relative z-10">{message}</p>
      <motion.button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity relative z-10"
        whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
        whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default Toast;
