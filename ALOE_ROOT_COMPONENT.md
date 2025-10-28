# AloeRoot Component Documentation

## Overview

The `AloeRoot` component is a decorative SVG-based component that represents the geometric, interlocking root structure of an Aloe plant. It symbolizes data persistence, security, and deep foundations in the Voice-to-Invoice application.

## Design Philosophy

The AloeRoot embodies the "Agile Aloe" design system's core metaphor:
- **Resilience**: Deep roots represent stable, persistent data storage
- **Security**: Interlocking structure symbolizes robust data protection
- **South African Heritage**: Aloe is native to Southern Africa, authentic to the ZAR market
- **Low-Poly Aesthetic**: Geometric shapes create a modern, clean look

## Features

- ✅ Geometric, interlocking root structure with 11 segments
- ✅ Deep sage green color palette with subtle glow
- ✅ Growth animation when data is saved
- ✅ Low-poly aesthetic with soft shadows
- ✅ Respects `prefers-reduced-motion` accessibility setting
- ✅ Fully customizable size and styling
- ✅ Callback support for animation completion

## Usage

### Basic Usage

```tsx
import { AloeRoot } from './components/AloeRoot';

function SecuritySection() {
  return (
    <div className="flex justify-center">
      <AloeRoot />
    </div>
  );
}
```

### With Growth Animation

```tsx
import { AloeRoot } from './components/AloeRoot';
import { useState } from 'react';

function DataSaveIndicator() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveData();
    // Animation will complete automatically
  };

  return (
    <AloeRoot
      isGrowing={isSaving}
      onGrowthComplete={() => {
        setIsSaving(false);
        console.log('Data saved successfully!');
      }}
    />
  );
}
```

### Custom Size

```tsx
<AloeRoot size={400} />
```

### With Custom Styling

```tsx
<AloeRoot 
  size={250}
  className="opacity-80 hover:opacity-100 transition-opacity"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isGrowing` | `boolean` | `false` | Triggers the growth animation when true |
| `size` | `number` | `300` | Size of the component in pixels (width and height) |
| `className` | `string` | `''` | Additional CSS classes to apply |
| `onGrowthComplete` | `() => void` | `undefined` | Callback fired when growth animation completes |

## Use Cases

### 1. Security Section Decoration

Perfect for settings pages or security-related sections to visually represent data protection:

```tsx
<div className="grid md:grid-cols-2 gap-8 items-center">
  <div>
    <h3 className="text-xl font-semibold">Your Data is Secure</h3>
    <p>All your invoice data is stored locally with deep, resilient persistence.</p>
  </div>
  <AloeRoot size={250} />
</div>
```

### 2. Data Persistence Indicator

Show users when data is being saved to local storage:

```tsx
function SaveIndicator({ isSaving }: { isSaving: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <AloeRoot size={200} isGrowing={isSaving} />
      <p className="text-sage-300">
        {isSaving ? 'Saving your data...' : 'Data securely stored'}
      </p>
    </div>
  );
}
```

### 3. Footer Decoration

Add visual interest to page footers:

```tsx
<footer className="bg-space-dark py-12">
  <div className="container mx-auto flex justify-center">
    <AloeRoot size={150} className="opacity-30" />
  </div>
</footer>
```

### 4. Settings Page Background

Use as a subtle background element:

```tsx
<div className="relative">
  <AloeRoot 
    size={600} 
    className="absolute top-0 right-0 opacity-5 pointer-events-none"
  />
  <div className="relative z-10">
    {/* Settings content */}
  </div>
</div>
```

## Animation Details

### Growth Animation

When `isGrowing` is set to `true`, the component animates each root segment growing from top to bottom:

- **Duration**: ~2.5 seconds total
- **Stagger**: Each segment starts 0.1-0.4s after the previous
- **Physics**: Spring animation with stiffness: 100, damping: 15
- **Glow**: Pulsing ambient glow during growth
- **Particles**: Small geometric particles rise from the roots

### Reduced Motion

The component respects the user's `prefers-reduced-motion` setting:
- When enabled, all animations are disabled
- Component renders in final state immediately
- Maintains full functionality without motion

## Color Palette

The AloeRoot uses the sage green color scale from the Aloe design system:

- **Primary**: `#6b8e23` (sage-500)
- **Dark**: `#4a6619` (sage-700)
- **Medium**: `#5a7a1e` (sage-600)
- **Light**: `#8ba888` (sage-400)
- **Glow**: `rgba(107, 142, 35, 0.2-0.6)`

## Technical Details

### SVG Structure

- **ViewBox**: `0 0 300 250`
- **Root Segments**: 11 geometric paths
- **Connection Nodes**: 7 circular nodes at intersections
- **Highlight Overlays**: 5 semi-transparent overlays for depth
- **Filters**: Soft shadow and glow filters for low-poly aesthetic

### Performance

- **Lightweight**: Pure SVG, no WebGL required
- **Scalable**: Vector-based, looks crisp at any size
- **Optimized**: Minimal DOM nodes, efficient animations
- **Accessible**: Works without JavaScript, respects motion preferences

## Accessibility

- ✅ Respects `prefers-reduced-motion`
- ✅ Decorative element (no ARIA labels needed)
- ✅ Does not interfere with screen readers
- ✅ Maintains visual hierarchy

## Browser Support

Works in all modern browsers that support:
- SVG (99%+ support)
- CSS filters (98%+ support)
- Framer Motion (all React-compatible browsers)

## Examples

See `src/components/__tests__/AloeRoot.visual.tsx` for interactive examples and visual tests.

## Related Components

- **AloeBloom**: Success animation (blooming flower)
- **AloeGrowthPulse**: AI processing indicator (pulsing glow)
- **AloePattern**: Background pattern (geometric texture)

## Design System Integration

The AloeRoot is part of the "Agile Aloe" design system, which uses culturally meaningful, geometric components inspired by the Aloe plant. This creates a unique visual identity that resonates with the South African market while embodying values of resilience, stability, and financial wellness.

## Tips

1. **Size Guidelines**:
   - Small (150px): Footer decorations, inline indicators
   - Medium (300px): Section decorations, feature highlights
   - Large (400-600px): Hero sections, background elements

2. **Placement**:
   - Works best on dark backgrounds (space-dark)
   - Pairs well with glass surfaces
   - Consider opacity for background usage

3. **Animation Timing**:
   - Use growth animation sparingly (on save, on success)
   - Don't trigger repeatedly in quick succession
   - Pair with status text for clarity

4. **Accessibility**:
   - Always provide text alternatives for meaning
   - Don't rely solely on animation to convey information
   - Test with reduced motion enabled

## Troubleshooting

**Animation not playing?**
- Check that `isGrowing` prop is changing from `false` to `true`
- Verify user doesn't have `prefers-reduced-motion` enabled
- Ensure Framer Motion is installed

**Component too large/small?**
- Adjust the `size` prop (default is 300px)
- Use CSS transforms for fine-tuning: `className="scale-75"`

**Colors not matching design?**
- Verify Tailwind config includes Aloe color palette
- Check that theme colors are properly imported
- Ensure no conflicting CSS overrides

## Contributing

When modifying the AloeRoot component:
1. Maintain the geometric, low-poly aesthetic
2. Keep the sage green color palette
3. Ensure animations respect `prefers-reduced-motion`
4. Update tests in `__tests__/AloeRoot.test.tsx`
5. Update visual tests in `__tests__/AloeRoot.visual.tsx`
6. Document any new props or behaviors

## License

Part of the Voice-to-Invoice application. See project LICENSE for details.
