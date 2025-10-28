# AloeRoot Component Usage

## Overview

The `AloeRoot` component is a decorative SVG component that represents a geometric, interlocking root structure. It's designed to symbolize data persistence, security, and foundation - perfect for security sections, settings pages, or anywhere you want to emphasize stability and deep reserves.

## Features

- **Geometric Design**: Low-poly, interlocking root structure with 9 segments
- **Deep Sage Green**: Uses the Aloe design system's sage green palette with subtle glow
- **Growth Animation**: Optional animation that shows roots "growing" when data is saved
- **Soft Shadows**: Low-poly aesthetic with soft drop shadows for depth
- **Accessibility**: Respects `prefers-reduced-motion` user preference
- **Customizable**: Configurable size and className

## Props

```typescript
interface AloeRootProps {
  animate?: boolean;  // Enable growth animation (default: false)
  size?: number;      // Size in pixels (default: 300)
  className?: string; // Additional CSS classes
}
```

## Usage Examples

### Basic Usage (Static)

```tsx
import { AloeRoot } from '../components/AloeRoot';

function SecuritySection() {
  return (
    <div className="flex items-center justify-center p-8">
      <AloeRoot />
    </div>
  );
}
```

### With Growth Animation

Use the `animate` prop to trigger the growth animation when data is saved:

```tsx
import { AloeRoot } from '../components/AloeRoot';
import { useState } from 'react';

function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings();
    // Animation will play while isSaving is true
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div className="settings-container">
      <h2>Security Settings</h2>
      
      {/* Show animated roots when saving */}
      <div className="flex justify-center my-8">
        <AloeRoot animate={isSaving} size={200} />
      </div>
      
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
}
```

### Custom Size

```tsx
// Small decorative element
<AloeRoot size={150} className="opacity-50" />

// Large hero element
<AloeRoot size={500} />
```

### In Security/Persistence Sections

```tsx
function DataPersistenceInfo() {
  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-6">
        <AloeRoot size={120} />
        <div>
          <h3 className="text-xl font-semibold text-sage-500">
            Local Data Persistence
          </h3>
          <p className="text-gray-400">
            Your data is securely stored locally with deep roots in your device.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### As Footer Decoration

```tsx
function Footer() {
  return (
    <footer className="relative bg-space-dark py-12">
      {/* Decorative roots in background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20">
        <AloeRoot size={400} />
      </div>
      
      <div className="relative z-10">
        <p className="text-center text-gray-400">
          Built with resilience and stability
        </p>
      </div>
    </footer>
  );
}
```

## Design Philosophy

The AloeRoot component is part of the "Agile Aloe" design system, which uses the Aloe plant as a metaphor for:

- **Resilience**: Aloe plants thrive in harsh conditions
- **Deep Reserves**: Aloe stores water in its leaves, symbolizing data persistence
- **Foundation**: Strong root systems represent security and stability
- **South African Heritage**: Aloe is native to Southern Africa, authentic to the ZAR market

## Animation Details

When `animate={true}`:

1. **Growth Animation**: Each root segment grows from the center outward with staggered delays
2. **Ambient Glow**: Pulsing glow effect around the roots (2s cycle)
3. **Highlight Nodes**: Three key connection points pulse with light
4. **Spring Physics**: Natural, organic motion using spring animations

The animation respects the user's `prefers-reduced-motion` setting and will be disabled if the user has requested reduced motion.

## Styling Tips

```tsx
// Subtle background decoration
<AloeRoot className="opacity-10 absolute bottom-0 right-0" size={600} />

// Glowing accent
<AloeRoot className="drop-shadow-2xl" animate={true} />

// Centered hero element
<div className="flex items-center justify-center min-h-screen">
  <AloeRoot size={400} animate={true} />
</div>
```

## Performance

- **SVG-based**: Scalable and crisp at any size
- **Lightweight**: No heavy dependencies beyond Framer Motion
- **GPU-accelerated**: Uses CSS transforms for smooth animations
- **Optimized**: Respects reduced motion preferences

## Accessibility

- Purely decorative (no interactive elements)
- Respects `prefers-reduced-motion`
- Does not interfere with screen readers
- Maintains visual clarity at all sizes
