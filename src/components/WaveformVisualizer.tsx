import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface WaveformVisualizerProps {
  audioLevel: number;
  analyser?: AnalyserNode | null;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioLevel,
  analyser,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(32).fill(0));
  const animationFrameRef = useRef<number | null>(null);
  const previousDataRef = useRef<number[]>(new Array(32).fill(0));

  useEffect(() => {
    if (!analyser || prefersReducedMotion) return;

    const updateFrequencyData = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Sample 32 bars from the frequency data
      const bars = 32;
      const step = Math.floor(dataArray.length / bars);
      const newData = [];

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step];
        // Normalize to 0-100 range
        const normalized = (value / 255) * 100;
        
        // Smooth interpolation: blend with previous value for smoother transitions
        const previous = previousDataRef.current[i] || 0;
        const smoothingFactor = 0.7; // Higher = more responsive, lower = smoother
        const interpolated = previous + (normalized - previous) * smoothingFactor;
        
        newData.push(interpolated);
      }

      previousDataRef.current = newData;
      setFrequencyData(newData);
      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    updateFrequencyData();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, prefersReducedMotion]);

  // Get color based on amplitude
  const getColorForAmplitude = (value: number): string => {
    if (value < 30) {
      // Low: sage green
      return '#6b8e23';
    } else if (value < 70) {
      // Medium: gold
      return '#daa520';
    } else {
      // High: terracotta
      return '#d2691e';
    }
  };

  // Fallback to simple bars if no analyser
  if (!analyser || prefersReducedMotion) {
    const simpleLevel = Math.min(100, audioLevel);
    return (
      <div className={`flex items-end gap-1 h-20 ${className}`}>
        {Array.from({ length: 32 }).map((_, i) => {
          const height = (simpleLevel / 100) * (Math.random() * 0.5 + 0.5);
          return (
            <div
              key={i}
              className="w-1 rounded-t-sm transition-all duration-100"
              style={{
                height: `${height * 100}%`,
                backgroundColor: getColorForAmplitude(height * 100),
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 320 100"
      className={`w-full ${className}`}
      style={{ maxWidth: '320px', height: '100px' }}
    >
      <defs>
        {/* Gradients for different amplitude levels */}
        <linearGradient id="sage-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8ba888" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6b8e23" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4d03f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#daa520" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="terracotta-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8a87c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d2691e" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Render frequency bars with geometric aloe-leaf shape */}
      {frequencyData.map((value, i) => {
        const x = i * 10;
        const height = Math.max(5, value);
        const y = 100 - height;
        const color = getColorForAmplitude(value);
        
        // Determine gradient based on color
        let gradient = 'url(#sage-gradient)';
        if (color === '#daa520') gradient = 'url(#gold-gradient)';
        if (color === '#d2691e') gradient = 'url(#terracotta-gradient)';

        return (
          <motion.path
            key={i}
            // Geometric aloe-leaf shape (pointed top)
            d={`M${x + 1},100 L${x + 1},${y + 2} L${x + 5},${y} L${x + 9},${y + 2} L${x + 9},100 Z`}
            fill={gradient}
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
};
