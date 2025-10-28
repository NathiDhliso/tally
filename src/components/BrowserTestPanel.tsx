import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  detectBrowser,
  checkFeatureSupport,
  getPerformanceTier,
  type BrowserInfo,
  type FeatureSupport,
} from '../utils/browserDetection';
import Card from './Card';
import Button from './Button';

/**
 * Browser Test Panel Component
 * 
 * Visual component for testing browser compatibility and feature support.
 * Useful for manual cross-browser testing and debugging.
 */
export const BrowserTestPanel: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [featureSupport, setFeatureSupport] = useState<FeatureSupport | null>(null);
  const [performanceTier, setPerformanceTier] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setBrowserInfo(detectBrowser());
    setFeatureSupport(checkFeatureSupport());
    setPerformanceTier(getPerformanceTier());
  }, []);

  const runAnimationTest = () => {
    setTestResults((prev) => ({ ...prev, animation: true }));
    setTimeout(() => {
      setTestResults((prev) => ({ ...prev, animation: false }));
    }, 2000);
  };

  const runGlassTest = () => {
    setTestResults((prev) => ({ ...prev, glass: true }));
    setTimeout(() => {
      setTestResults((prev) => ({ ...prev, glass: false }));
    }, 2000);
  };

  if (!browserInfo || !featureSupport) {
    return <div>Loading browser information...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent">
        Browser Compatibility Test Panel
      </h1>

      {/* Browser Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-sage-400">Browser Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Browser</p>
            <p className="text-lg font-medium">{browserInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Version</p>
            <p className="text-lg font-medium">{browserInfo.version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Platform</p>
            <p className="text-lg font-medium">
              {browserInfo.isMobile ? 'Mobile' : 'Desktop'}
              {browserInfo.isIOS ? ' (iOS)' : ''}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Performance Tier</p>
            <p className="text-lg font-medium capitalize">{performanceTier}</p>
          </div>
        </div>
      </Card>

      {/* Feature Support */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-sage-400">Feature Support</h2>
        <div className="space-y-3">
          {Object.entries(featureSupport).map(([feature, supported]) => (
            <div key={feature} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">
                {feature.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  supported
                    ? 'bg-sage-500/20 text-sage-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {supported ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Visual Tests */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-sage-400">Visual Tests</h2>
        <div className="space-y-6">
          {/* Glassmorphism Test */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Glassmorphism Effect</h3>
              <Button onClick={runGlassTest} size="sm">
                Test Glass Effect
              </Button>
            </div>
            <motion.div
              className="h-32 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
              animate={
                testResults.glass
                  ? { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }
                  : {}
              }
              transition={{ duration: 1 }}
            >
              <p className="text-gray-300">
                {featureSupport.backdropFilter
                  ? 'Glassmorphism Active'
                  : 'Fallback Mode'}
              </p>
            </motion.div>
          </div>

          {/* Animation Test */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">CSS & Framer Motion Animations</h3>
              <Button onClick={runAnimationTest} size="sm">
                Test Animations
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="h-24 rounded-lg bg-sage-500/20 flex items-center justify-center"
                animate={
                  testResults.animation
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }
                    : {}
                }
                transition={{ duration: 2 }}
              >
                <span className="text-sm">Scale + Rotate</span>
              </motion.div>
              <motion.div
                className="h-24 rounded-lg bg-gold-500/20 flex items-center justify-center"
                animate={
                  testResults.animation
                    ? {
                        y: [0, -20, 0],
                        opacity: [1, 0.5, 1],
                      }
                    : {}
                }
                transition={{ duration: 2 }}
              >
                <span className="text-sm">Fade + Move</span>
              </motion.div>
              <motion.div
                className="h-24 rounded-lg bg-terracotta-500/20 flex items-center justify-center"
                animate={
                  testResults.animation
                    ? {
                        boxShadow: [
                          '0 0 0px rgba(210, 105, 30, 0.5)',
                          '0 0 30px rgba(210, 105, 30, 0.8)',
                          '0 0 0px rgba(210, 105, 30, 0.5)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2 }}
              >
                <span className="text-sm">Glow Pulse</span>
              </motion.div>
            </div>
          </div>

          {/* SVG Rendering Test */}
          <div>
            <h3 className="font-medium mb-3">SVG Rendering</h3>
            <svg
              className="w-full h-32"
              viewBox="0 0 400 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="test-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6b8e23" />
                  <stop offset="50%" stopColor="#daa520" />
                  <stop offset="100%" stopColor="#d2691e" />
                </linearGradient>
              </defs>
              <rect
                x="10"
                y="10"
                width="380"
                height="80"
                fill="url(#test-gradient)"
                rx="8"
              />
              <text
                x="200"
                y="55"
                textAnchor="middle"
                fill="white"
                fontSize="20"
                fontWeight="bold"
              >
                SVG Gradient Test
              </text>
            </svg>
          </div>

          {/* Touch Events Test (Mobile) */}
          {featureSupport.touchEvents && (
            <div>
              <h3 className="font-medium mb-3">Touch Events</h3>
              <motion.div
                className="h-32 rounded-lg bg-sage-500/20 flex items-center justify-center cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-gray-300">Tap to test touch feedback</p>
              </motion.div>
            </div>
          )}
        </div>
      </Card>

      {/* System Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-sage-400">System Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">User Agent:</span>
            <span className="text-gray-300 text-right max-w-md truncate">
              {navigator.userAgent}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hardware Concurrency:</span>
            <span className="text-gray-300">
              {navigator.hardwareConcurrency || 'Unknown'} cores
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Screen Resolution:</span>
            <span className="text-gray-300">
              {window.screen.width} × {window.screen.height}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Device Pixel Ratio:</span>
            <span className="text-gray-300">{window.devicePixelRatio}</span>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-sage-500/10 border-sage-500/30">
        <h2 className="text-xl font-semibold mb-4 text-sage-400">Testing Instructions</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✅ Verify all features show as "Supported" in your browser</li>
          <li>✅ Test glassmorphism effect - should see blur behind elements</li>
          <li>✅ Test animations - should be smooth at 60fps</li>
          <li>✅ Test SVG rendering - gradient should be smooth</li>
          <li>✅ On mobile: Test touch interactions</li>
          <li>✅ Check console for any errors or warnings</li>
        </ul>
      </Card>
    </div>
  );
};
