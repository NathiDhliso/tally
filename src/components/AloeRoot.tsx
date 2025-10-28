import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AloeRootProps {
  /** Whether to trigger the growth animation */
  isGrowing?: boolean;
  /** Size of the component in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Callback when growth animation completes */
  onGrowthComplete?: () => void;
}

/**
 * AloeRoot Component
 * 
 * A decorative component representing the geometric, interlocking root structure
 * of an Aloe plant. Symbolizes data persistence, security, and deep foundations.
 * 
 * Features:
 * - Geometric, low-poly aesthetic with soft shadows
 * - Deep sage green with subtle glow
 * - Growth animation when data is saved
 * - Perfect for security sections and data persistence indicators
 * 
 * Usage:
 * ```tsx
 * <AloeRoot isGrowing={dataSaved} onGrowthComplete={() => console.log('Saved!')} />
 * ```
 */
export const AloeRoot: React.FC<AloeRootProps> = ({
  isGrowing = false,
  size = 300,
  className = '',
  onGrowthComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Root segments - geometric, interlocking paths
  const rootSegments = [
    // Main central root
    {
      path: 'M150,50 L155,80 L150,120 L145,80 Z',
      delay: 0,
      color: '#4a6619',
    },
    // Left primary root
    {
      path: 'M145,80 L130,100 L120,140 L125,100 Z',
      delay: 0.1,
      color: '#5a7a1e',
    },
    // Right primary root
    {
      path: 'M155,80 L170,100 L180,140 L175,100 Z',
      delay: 0.1,
      color: '#5a7a1e',
    },
    // Left secondary root
    {
      path: 'M125,100 L110,120 L95,160 L105,125 Z',
      delay: 0.2,
      color: '#6b8e23',
    },
    // Right secondary root
    {
      path: 'M175,100 L190,120 L205,160 L195,125 Z',
      delay: 0.2,
      color: '#6b8e23',
    },
    // Left tertiary root
    {
      path: 'M105,125 L90,145 L75,180 L85,150 Z',
      delay: 0.3,
      color: '#8ba888',
    },
    // Right tertiary root
    {
      path: 'M195,125 L210,145 L225,180 L215,150 Z',
      delay: 0.3,
      color: '#8ba888',
    },
    // Left deep root
    {
      path: 'M85,150 L70,170 L60,200 L68,175 Z',
      delay: 0.4,
      color: '#3a5214',
    },
    // Right deep root
    {
      path: 'M215,150 L230,170 L240,200 L232,175 Z',
      delay: 0.4,
      color: '#3a5214',
    },
    // Center-left connector
    {
      path: 'M130,100 L125,120 L120,140 L125,120 Z',
      delay: 0.15,
      color: '#6b8e23',
    },
    // Center-right connector
    {
      path: 'M170,100 L175,120 L180,140 L175,120 Z',
      delay: 0.15,
      color: '#6b8e23',
    },
  ];

  // Growth animation variants
  const rootVariants: any = {
    hidden: {
      scaleY: 0,
      opacity: 0,
      originY: 0,
    },
    visible: (delay: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: delay,
        duration: 0.6,
      },
    }),
  };

  const glowVariants: any = {
    idle: {
      opacity: 0.3,
      filter: 'blur(8px)',
    },
    growing: {
      opacity: [0.3, 0.6, 0.3],
      filter: ['blur(8px)', 'blur(12px)', 'blur(8px)'],
      transition: {
        duration: 1.5,
        repeat: 2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(107, 142, 35, 0.2) 0%, rgba(74, 102, 25, 0.1) 50%, transparent 70%)',
        }}
        initial="idle"
        animate={isGrowing && !prefersReducedMotion ? 'growing' : 'idle'}
        variants={prefersReducedMotion ? undefined : glowVariants}
      />

      {/* SVG Root Structure */}
      <svg
        viewBox="0 0 300 250"
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Sage gradient for depth */}
          <linearGradient
            id="root-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6b8e23" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#5a7a1e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a6619" stopOpacity="1" />
          </linearGradient>

          {/* Soft shadow filter for low-poly aesthetic */}
          <filter id="root-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="3" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter */}
          <filter id="root-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.42
                      0 0 0 0 0.56
                      0 0 0 0 0.14
                      0 0 0 0.6 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render root segments with growth animation */}
        {rootSegments.map((segment, index) => (
          <motion.path
            key={index}
            d={segment.path}
            fill={segment.color}
            filter="url(#root-shadow)"
            initial={isGrowing && !prefersReducedMotion ? 'hidden' : 'visible'}
            animate="visible"
            custom={segment.delay}
            variants={prefersReducedMotion ? undefined : rootVariants}
            onAnimationComplete={
              index === rootSegments.length - 1 ? onGrowthComplete : undefined
            }
            style={{
              transformOrigin: 'center top',
            }}
          />
        ))}

        {/* Highlight overlays for depth */}
        {rootSegments.slice(0, 5).map((segment, index) => (
          <motion.path
            key={`highlight-${index}`}
            d={segment.path}
            fill="rgba(139, 168, 136, 0.3)"
            filter="url(#root-glow)"
            initial={isGrowing && !prefersReducedMotion ? 'hidden' : 'visible'}
            animate="visible"
            custom={segment.delay + 0.05}
            variants={prefersReducedMotion ? undefined : rootVariants}
            style={{
              transformOrigin: 'center top',
            }}
          />
        ))}

        {/* Connection nodes (geometric circles at intersections) */}
        {[
          { cx: 150, cy: 80, r: 4, delay: 0 },
          { cx: 130, cy: 100, r: 3.5, delay: 0.1 },
          { cx: 170, cy: 100, r: 3.5, delay: 0.1 },
          { cx: 110, cy: 120, r: 3, delay: 0.2 },
          { cx: 190, cy: 120, r: 3, delay: 0.2 },
          { cx: 90, cy: 145, r: 2.5, delay: 0.3 },
          { cx: 210, cy: 145, r: 2.5, delay: 0.3 },
        ].map((node, index) => (
          <motion.circle
            key={`node-${index}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#8ba888"
            filter="url(#root-glow)"
            initial={isGrowing && !prefersReducedMotion ? 'hidden' : 'visible'}
            animate="visible"
            custom={node.delay}
            variants={prefersReducedMotion ? undefined : rootVariants}
          />
        ))}
      </svg>

      {/* Subtle particle effects during growth */}
      {isGrowing && !prefersReducedMotion && (
        <svg
          viewBox="0 0 300 250"
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Small geometric particles rising from roots */}
          {[0, 1, 2, 3, 4].map((index) => {
            const x = 100 + index * 25;
            const y = 180 + Math.random() * 20;
            return (
              <motion.path
                key={`particle-${index}`}
                d={`M${x},${y} L${x + 2},${y + 4} L${x},${y + 6} L${x - 2},${y + 4} Z`}
                fill="#8ba888"
                opacity="0.6"
                animate={{
                  y: [0, -30, -60],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: 1,
                  ease: 'easeOut',
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
