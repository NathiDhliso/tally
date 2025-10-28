import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AloeGrowthPulseProps {
  size?: number;
  className?: string;
}

export const AloeGrowthPulse: React.FC<AloeGrowthPulseProps> = ({
  size = 200,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Geometric ripple shapes (hexagonal/diamond patterns, not circular)
  const ripples = [
    { scale: 1, opacity: 0.6, delay: 0 },
    { scale: 1.3, opacity: 0.4, delay: 0.3 },
    { scale: 1.6, opacity: 0.2, delay: 0.6 },
  ];

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center ${className}`}
    >
      {/* Central glow with color transition */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ width: size, height: size }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                background: [
                  'radial-gradient(circle, rgba(107, 142, 35, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(218, 165, 32, 0.4) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(107, 142, 35, 0.3) 0%, transparent 70%)',
                ],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Geometric ripple effects */}
      {!prefersReducedMotion && (
        <svg
          viewBox="0 0 200 200"
          className="absolute"
          style={{ width: size * 1.5, height: size * 1.5 }}
        >
          <defs>
            {/* Sage to gold gradient */}
            <linearGradient
              id="pulse-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6b8e23" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8ba888" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#daa520" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Geometric ripples (hexagonal shapes) */}
          {ripples.map((ripple, index) => (
            <motion.g key={index}>
              {/* Hexagonal ripple */}
              <motion.path
                d="M100,40 L130,60 L130,100 L100,120 L70,100 L70,60 Z"
                fill="none"
                stroke="url(#pulse-gradient)"
                strokeWidth="2"
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    scale: ripple.scale * 0.5,
                    opacity: 0,
                  },
                  animate: {
                    scale: [
                      ripple.scale * 0.5,
                      ripple.scale * 1.5,
                      ripple.scale * 2,
                    ],
                    opacity: [0, ripple.opacity, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: ripple.delay,
                    },
                  },
                }}
                style={{ transformOrigin: '100px 80px' }}
              />

              {/* Diamond accent */}
              <motion.path
                d="M100,50 L115,80 L100,110 L85,80 Z"
                fill="none"
                stroke="url(#pulse-gradient)"
                strokeWidth="1.5"
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    scale: ripple.scale * 0.6,
                    opacity: 0,
                  },
                  animate: {
                    scale: [
                      ripple.scale * 0.6,
                      ripple.scale * 1.3,
                      ripple.scale * 1.8,
                    ],
                    opacity: [0, ripple.opacity * 0.8, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: ripple.delay + 0.1,
                    },
                  },
                }}
                style={{ transformOrigin: '100px 80px' }}
              />
            </motion.g>
          ))}
        </svg>
      )}

      {/* Breathing glow overlay */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          boxShadow: '0 0 40px rgba(107, 142, 35, 0.4)',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                boxShadow: [
                  '0 0 20px rgba(107, 142, 35, 0.3)',
                  '0 0 40px rgba(218, 165, 32, 0.5)',
                  '0 0 20px rgba(107, 142, 35, 0.3)',
                ],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Particle accents */}
      {!prefersReducedMotion && (
        <svg
          viewBox="0 0 200 200"
          className="absolute"
          style={{ width: size, height: size }}
        >
          {/* Small geometric particles */}
          {[0, 60, 120, 180, 240, 300].map((angle, index) => {
            const x = 100 + Math.cos((angle * Math.PI) / 180) * 60;
            const y = 100 + Math.sin((angle * Math.PI) / 180) * 60;
            return (
              <motion.path
                key={index}
                d={`M${x},${y} L${x + 3},${y + 5} L${x},${y + 8} L${x - 3},${y + 5} Z`}
                fill="#daa520"
                opacity="0.6"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};
