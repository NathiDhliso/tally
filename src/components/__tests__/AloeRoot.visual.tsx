import { useState } from 'react';
import { AloeRoot } from '../AloeRoot';

/**
 * Visual test component for AloeRoot
 * 
 * This component is used for manual visual testing and demonstration.
 * Run the dev server and navigate to this component to see the AloeRoot in action.
 */
export const AloeRootVisualTest = () => {
  const [isGrowing, setIsGrowing] = useState(false);

  const triggerGrowth = () => {
    setIsGrowing(true);
    setTimeout(() => setIsGrowing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-space-dark p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          AloeRoot Visual Test
        </h1>

        {/* Default state */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-sage-400">
            Default State
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex justify-center">
            <AloeRoot />
          </div>
        </section>

        {/* Growing state */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-sage-400">
            Growing Animation
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col items-center gap-4">
            <AloeRoot
              isGrowing={isGrowing}
              onGrowthComplete={() => console.log('Growth complete!')}
            />
            <button
              onClick={triggerGrowth}
              className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors"
              disabled={isGrowing}
            >
              {isGrowing ? 'Growing...' : 'Trigger Growth'}
            </button>
          </div>
        </section>

        {/* Different sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-sage-400">
            Different Sizes
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex justify-around items-end">
            <div className="text-center">
              <AloeRoot size={150} />
              <p className="text-sage-300 mt-2">Small (150px)</p>
            </div>
            <div className="text-center">
              <AloeRoot size={300} />
              <p className="text-sage-300 mt-2">Medium (300px)</p>
            </div>
            <div className="text-center">
              <AloeRoot size={400} />
              <p className="text-sage-300 mt-2">Large (400px)</p>
            </div>
          </div>
        </section>

        {/* Use case: Security section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-sage-400">
            Use Case: Security Section
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Data is Secure
                </h3>
                <p className="text-gray-300 mb-4">
                  All your invoice data is stored locally on your device with
                  deep, resilient persistence. Like the roots of an Aloe plant,
                  your data foundation is strong and secure.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li>✓ Local-first storage</li>
                  <li>✓ Encrypted at rest</li>
                  <li>✓ No cloud dependencies</li>
                  <li>✓ Full data ownership</li>
                </ul>
              </div>
              <div className="flex justify-center">
                <AloeRoot size={250} />
              </div>
            </div>
          </div>
        </section>

        {/* Use case: Data saved indicator */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-sage-400">
            Use Case: Data Saved Indicator
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="flex flex-col items-center gap-4">
              <AloeRoot size={200} isGrowing={isGrowing} />
              <p className="text-sage-300 text-center">
                {isGrowing
                  ? 'Saving your data...'
                  : 'Data securely stored'}
              </p>
              <button
                onClick={triggerGrowth}
                className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors"
                disabled={isGrowing}
              >
                Simulate Save
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AloeRootVisualTest;
