import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const prefersReducedMotion = useReducedMotion();

  const baseStyles =
    'relative rounded-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variantStyles = {
    primary:
      'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 hover:shadow-glow-sage-lg transition-shadow duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    secondary:
      'bg-sage-500/10 backdrop-blur-md border border-sage-500/20 text-sage-400 hover:bg-sage-500/15 hover:shadow-glow-sage-lg transition-shadow duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
    outline:
      'border-2 border-sage-500/50 text-sage-400 hover:bg-sage-500/10 hover:shadow-glow-sage-lg backdrop-blur-sm transition-shadow duration-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-touch',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`group ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{ willChange: !isDisabled && !prefersReducedMotion ? 'transform' : 'auto' }}
      whileHover={!isDisabled && !prefersReducedMotion ? { 
        scale: 1.05,
        boxShadow: '0 0 40px rgba(107, 142, 35, 0.8)'
      } : {}}
      whileTap={!isDisabled && !prefersReducedMotion ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      {...props}
    >
      {/* Shimmer overlay for loading state */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}

      {/* Gradient border on focus - using pseudo-element approach */}
      <span className="absolute inset-0 rounded-lg opacity-0 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 bg-gradient-to-r from-sage-500 to-gold-500 blur-sm" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        {loading ? (
          <motion.svg
            className="w-5 h-5"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        ) : (
          children
        )}
        {icon && iconPosition === 'right' && !loading && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

export default Button;
