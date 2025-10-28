import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AloeSpinnerProps {
  size?: number;
  className?: string;
}

/**
 * AloeSpinner - Geometric aloe-inspired spinner for processing states
 * 
 * Features:
 * - Geometric hexagonal shape inspired by aloe leaf structure
 * - Sage-to-gold gradient
 * - Smooth rotation animation
 * - Respects prefers-reduced-motion
 */
export const AloeSpinner = ({ size = 48, className = '' }: AloeSpinnerProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              rotate: 360,
            }
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <defs>
        <linearGradient id="aloe-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b8e23" />
          <stop offset="50%" stopColor="#daa520" />
          <stop offset="100%" stopColor="#6b8e23" />
        </linearGradient>
      </defs>
      
      {/* Geometric hexagonal spinner with aloe-inspired points */}
      <g transform="translate(50, 50)">
        {/* Outer hexagon */}
        <motion.path
          d="M0,-40 L35,-20 L35,20 L0,40 L-35,20 L-35,-20 Z"
          fill="none"
          stroke="url(#aloe-spinner-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { pathLength: 1, opacity: 1 }
              : {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Inner geometric points (aloe leaves) */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => {
          const x = Math.cos((angle * Math.PI) / 180) * 25;
          const y = Math.sin((angle * Math.PI) / 180) * 25;
          return (
            <motion.path
              key={index}
              d={`M${x},${y} L${x + 3},${y + 8} L${x},${y + 12} L${x - 3},${y + 8} Z`}
              fill="url(#aloe-spinner-gradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.6, scale: 1 }
                  : {
                      opacity: [0, 0.8, 0],
                      scale: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1,
              }}
            />
          );
        })}
      </g>
    </motion.svg>
  );
};
