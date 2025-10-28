import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

const LoadingSkeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
}: LoadingSkeletonProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 relative overflow-hidden';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return (
    <motion.div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        />
      )}
      
      {/* Pulse effect for reduced motion */}
      {prefersReducedMotion && (
        <div className="animate-pulse w-full h-full" />
      )}
    </motion.div>
  );
};

export default LoadingSkeleton;
