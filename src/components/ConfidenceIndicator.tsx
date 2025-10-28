import { type ReactNode, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ConfidenceIndicatorProps {
  confidence: number;
  children: ReactNode;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSparkle?: boolean;
}

const ConfidenceIndicator = ({
  confidence,
  children,
  showPercentage = false,
  size = 'md',
  showSparkle = true,
}: ConfidenceIndicatorProps) => {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const [displayConfidence, setDisplayConfidence] = useState(0);

  // Smooth counting animation
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayConfidence(confidence);
      return;
    }

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = confidence / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(confidence, current + increment);
      setDisplayConfidence(Math.round(current));

      if (step >= steps || current >= confidence) {
        clearInterval(timer);
        setDisplayConfidence(confidence);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [confidence, prefersReducedMotion]);

  // Pulsing glow for low confidence - more prominent hotspot
  useEffect(() => {
    if (confidence < 85 && !prefersReducedMotion) {
      const glowIntensity = confidence < 60 
        ? ['0 0 15px rgba(245, 158, 11, 0.4)', '0 0 30px rgba(239, 68, 68, 0.6)', '0 0 15px rgba(245, 158, 11, 0.4)']
        : ['0 0 10px rgba(218, 165, 32, 0.3)', '0 0 20px rgba(218, 165, 32, 0.5)', '0 0 10px rgba(218, 165, 32, 0.3)'];
      
      controls.start({
        boxShadow: glowIntensity,
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        },
      });
    } else {
      controls.stop();
    }
  }, [confidence, controls, prefersReducedMotion]);

  const getGradient = () => {
    if (confidence < 60) {
      // Low: amber → red
      return 'from-amber-500 via-orange-500 to-red-500';
    } else if (confidence < 85) {
      // Medium: sage → gold
      return 'from-sage-500 via-sage-400 to-gold-500';
    } else {
      // High: sage → terracotta
      return 'from-sage-500 via-gold-500 to-terracotta-500';
    }
  };

  const getGradientId = () => {
    if (confidence < 60) return 'gradient-low';
    if (confidence < 85) return 'gradient-medium';
    return 'gradient-high';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { ring: 40, stroke: 3, text: 'text-xs' };
      case 'lg':
        return { ring: 80, stroke: 6, text: 'text-xl' };
      default:
        return { ring: 60, stroke: 4, text: 'text-sm' };
    }
  };

  const sizeConfig = getSizeClasses();
  const radius = (sizeConfig.ring - sizeConfig.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayConfidence / 100) * circumference;

  return (
    <div className="relative">
      {/* Glass container with children - enhanced border for low confidence */}
      <motion.div
        animate={controls}
        className={`relative bg-white/12 backdrop-blur-md rounded-lg overflow-hidden ${
          confidence < 85 
            ? 'border-2 border-gold-500/40' 
            : 'border border-white/20'
        }`}
        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
      >
        {children}

        {/* Circular progress ring overlay (top-right corner) */}
        {showPercentage && (
          <div className="absolute top-2 right-2 flex items-center justify-center">
            <svg
              width={sizeConfig.ring}
              height={sizeConfig.ring}
              className="transform -rotate-90"
            >
              <defs>
                {/* Low confidence gradient: amber → red */}
                <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                {/* Medium confidence gradient: sage → gold */}
                <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b8e23" />
                  <stop offset="50%" stopColor="#8ba888" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
                {/* High confidence gradient: sage → terracotta */}
                <linearGradient id="gradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b8e23" />
                  <stop offset="50%" stopColor="#daa520" />
                  <stop offset="100%" stopColor="#d2691e" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx={sizeConfig.ring / 2}
                cy={sizeConfig.ring / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={sizeConfig.stroke}
                fill="none"
              />
              {/* Progress circle with gradient */}
              <motion.circle
                cx={sizeConfig.ring / 2}
                cy={sizeConfig.ring / 2}
                r={radius}
                stroke={`url(#${getGradientId()})`}
                strokeWidth={sizeConfig.stroke}
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            {/* Percentage text */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${sizeConfig.text} font-bold text-white`}
            >
              {displayConfidence}%
            </div>
          </div>
        )}
      </motion.div>

      {/* Gradient indicator bar below */}
      {showPercentage && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getGradient()}`}
              initial={{ width: 0 }}
              animate={{ width: `${displayConfidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {confidence < 60 ? 'Low' : confidence < 85 ? 'Medium' : 'High'}
          </span>
        </div>
      )}

      {/* Sparkle effect for high confidence */}
      {showSparkle && confidence >= 85 && !prefersReducedMotion && (
        <motion.div
          className="absolute -top-1 -right-1 text-gold-500"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: [0, 1.2, 1], rotate: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="drop-shadow-lg"
          >
            <path d="M10 0L11.5 6.5L18 8L11.5 9.5L10 16L8.5 9.5L2 8L8.5 6.5L10 0Z" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
