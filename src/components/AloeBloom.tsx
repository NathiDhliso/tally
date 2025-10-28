import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AloeBloomProps {
  onComplete?: () => void;
  size?: number;
}

export const AloeBloom: React.FC<AloeBloomProps> = ({
  onComplete,
  size = 200,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Geometric petal paths (pointed aloe-inspired shapes)
  const petals = [
    // Center petals (6 petals arranged in a circle)
    'M100,60 L110,80 L100,100 L90,80 Z', // Top
    'M120,75 L130,90 L115,105 L105,90 Z', // Top-right
    'M120,105 L130,110 L115,125 L105,110 Z', // Bottom-right
    'M100,120 L110,130 L100,140 L90,130 Z', // Bottom
    'M80,105 L85,110 L70,125 L65,110 Z', // Bottom-left
    'M80,75 L85,90 L70,105 L65,90 Z', // Top-left
  ];

  const containerVariants: any = {
    hidden: { scale: 0, rotate: -45, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.8,
        staggerChildren: 0.05,
      },
    },
  };

  const petalVariants: any = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const glowVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? undefined : containerVariants}
      onAnimationComplete={onComplete}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(218, 165, 32, 0.4) 0%, rgba(210, 105, 30, 0.2) 50%, transparent 70%)',
        }}
        variants={prefersReducedMotion ? undefined : glowVariants}
      />

      {/* SVG Flower */}
      <motion.svg
        viewBox="0 0 200 200"
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Terracotta to Gold gradient */}
          <linearGradient
            id="petal-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#d2691e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e8a87c" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#daa520" stopOpacity="1" />
          </linearGradient>

          {/* Soft shadow filter */}
          <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render petals with stagger animation */}
        {petals.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            fill="url(#petal-gradient)"
            filter="url(#soft-shadow)"
            variants={prefersReducedMotion ? undefined : petalVariants}
            style={{
              transformOrigin: '100px 100px',
            }}
          />
        ))}

        {/* Center circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="15"
          fill="#6b8e23"
          filter="url(#soft-shadow)"
          variants={prefersReducedMotion ? undefined : petalVariants}
        />

        {/* Inner highlight */}
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="#8ba888"
          opacity="0.6"
          variants={prefersReducedMotion ? undefined : petalVariants}
        />
      </motion.svg>
    </motion.div>
  );
};
