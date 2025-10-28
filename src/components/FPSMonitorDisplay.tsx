/**
 * FPS Monitor Display Component
 * 
 * Visual FPS monitor for development and testing.
 * Shows real-time FPS and performance warnings.
 * 
 * Usage:
 * import { FPSMonitorDisplay } from './components/FPSMonitorDisplay';
 * 
 * // Add to your app (only in development)
 * {process.env.NODE_ENV === 'development' && <FPSMonitorDisplay />}
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FPSMonitor } from '../utils/performance';

interface FPSMonitorDisplayProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showWarnings?: boolean;
}

export const FPSMonitorDisplay: React.FC<FPSMonitorDisplayProps> = ({
  position = 'top-right',
  showWarnings = true,
}) => {
  const [fps, setFps] = useState(60);
  const [isVisible, setIsVisible] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const monitor = new FPSMonitor();

    monitor.start((currentFps) => {
      setFps(currentFps);

      // Show warning if FPS drops below 50
      if (showWarnings && currentFps < 50) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
      }
    });

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+F)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      monitor.stop();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showWarnings]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getFpsColor = (fps: number): string => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFpsBackground = (fps: number): string => {
    if (fps >= 55) return 'bg-green-500/10 border-green-500/30';
    if (fps >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`fixed ${positionClasses[position]} z-[9999] pointer-events-none`}
        >
          {/* FPS Display */}
          <div
            className={`
              ${getFpsBackground(fps)}
              backdrop-blur-md border rounded-lg px-3 py-2
              font-mono text-sm shadow-lg
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-white/70">FPS:</span>
              <span className={`font-bold ${getFpsColor(fps)}`}>{fps}</span>
            </div>
          </div>

          {/* Performance Warning */}
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-red-400 text-xs font-medium">
                    Performance Warning
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          <div className="mt-2 text-xs text-white/40 text-center">
            Ctrl+Shift+F to toggle
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Lightweight FPS Counter (minimal UI)
 */
export const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const monitor = new FPSMonitor();
    monitor.start(setFps);
    return () => monitor.stop();
  }, []);

  const color = fps >= 55 ? '#10b981' : fps >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div
      style={{
        position: 'fixed',
        top: '8px',
        right: '8px',
        padding: '4px 8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color,
        fontFamily: 'monospace',
        fontSize: '12px',
        borderRadius: '4px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {fps} FPS
    </div>
  );
};

export default FPSMonitorDisplay;
