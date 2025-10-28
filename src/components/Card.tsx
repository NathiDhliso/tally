import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  animatedBorder?: boolean;
}

const Card = ({
  children,
  className = '',
  onClick,
  hover = false,
  animatedBorder = false,
  ...props
}: CardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const baseStyles =
    'relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-inner-glow';

  return (
    <motion.div
      className={`${baseStyles} ${clickableClass} ${className}`}
      style={{ willChange: hover && !prefersReducedMotion ? 'transform, box-shadow' : 'auto' }}
      onClick={onClick}
      whileHover={
        hover && !prefersReducedMotion
          ? {
              y: -12,
              boxShadow: '0 20px 60px rgba(107, 142, 35, 0.4)',
              borderColor: 'rgba(107, 142, 35, 0.6)',
            }
          : {}
      }
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      {...props}
    >
      {/* Animated gradient border */}
      {animatedBorder && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #6b8e23, #daa520, #6b8e23)',
            backgroundSize: '200% 100%',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={
            !prefersReducedMotion
              ? {
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;
