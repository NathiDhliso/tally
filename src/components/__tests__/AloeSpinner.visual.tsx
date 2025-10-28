/**
 * Visual Test Component for AloeSpinner
 * 
 * This file is for manual visual testing during development.
 * Run the dev server and navigate to this component to see the spinner in action.
 * 
 * Usage: Import and render in a test page or Storybook
 */

import { AloeSpinner } from '../AloeSpinner';

export const AloeSpinnerVisualTest = () => {
  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center p-8">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">
            AloeSpinner Visual Test
          </h1>
        </div>

        {/* Default Size */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">Default Size (48px)</h2>
          <div className="bg-space-medium p-8 rounded-xl">
            <AloeSpinner />
          </div>
        </div>

        {/* Small Size */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">Small (32px)</h2>
          <div className="bg-space-medium p-8 rounded-xl">
            <AloeSpinner size={32} />
          </div>
        </div>

        {/* Medium Size */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">Medium (64px)</h2>
          <div className="bg-space-medium p-8 rounded-xl">
            <AloeSpinner size={64} />
          </div>
        </div>

        {/* Large Size */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">Large (96px)</h2>
          <div className="bg-space-medium p-8 rounded-xl">
            <AloeSpinner size={96} />
          </div>
        </div>

        {/* In Context - Processing State Simulation */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">In Context (Processing State)</h2>
          <div className="bg-space-medium p-12 rounded-xl relative">
            {/* Simulated AloeGrowthPulse background */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(circle, rgba(107, 142, 35, 0.2) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            
            {/* Spinner */}
            <div className="relative z-10">
              <AloeSpinner size={64} />
            </div>
            
            {/* Status Text */}
            <p className="text-gray-300 text-center mt-6 relative z-10">
              Processing your invoice...
            </p>
          </div>
        </div>

        {/* Multiple Spinners */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-300">Multiple Spinners</h2>
          <div className="bg-space-medium p-8 rounded-xl flex gap-8">
            <AloeSpinner size={32} />
            <AloeSpinner size={48} />
            <AloeSpinner size={64} />
            <AloeSpinner size={80} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default AloeSpinnerVisualTest;
