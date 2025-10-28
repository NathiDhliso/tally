# AloePattern Component Usage

## Overview

The `AloePattern` component provides a geometric background pattern inspired by aloe leaf structure. It's designed to be a subtle, static background element that reinforces the "Agile Aloe" design system theme throughout the application.

## Component Details

**Location:** `src/components/AloePattern.tsx`

**Purpose:** Provides a culturally meaningful, geometric background pattern that adds visual interest without distracting from content.

## Features

- ✅ SVG-based geometric pattern inspired by aloe leaf structure
- ✅ Very subtle (5% opacity by default)
- ✅ Static (no animation) for optimal performance
- ✅ Fully customizable (opacity, color, className)
- ✅ Positioned absolutely to cover full area
- ✅ Non-interactive (pointer-events-none)
- ✅ Responsive and scalable

## Props

```typescript
interface AloePatternProps {
  className?: string;  // Additional CSS classes
  opacity?: number;    // Pattern opacity (default: 0.05)
  color?: string;      // Pattern color (default: '#6b8e23' - sage green)
}
```

## Usage Examples

### Basic Usage (Default Settings)

```tsx
import { AloePattern } from '@/components/AloePattern';

function HomePage() {
  return (
    <div className="relative min-h-screen bg-space-dark">
      <AloePattern />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Custom Opacity

```tsx
<AloePattern opacity={0.1} />  {/* More visible */}
<AloePattern opacity={0.03} /> {/* More subtle */}
```

### Custom Color

```tsx
{/* Use terracotta for warm sections */}
<AloePattern color="#d2691e" />

{/* Use gold for highlight sections */}
<AloePattern color="#daa520" />

{/* Use custom color */}
<AloePattern color="rgba(107, 142, 35, 0.8)" />
```

### With Custom Classes

```tsx
<AloePattern className="mix-blend-overlay" />
```

## Design Pattern

The AloePattern consists of:

1. **Central Pointed Leaf Shape** - Main aloe leaf structure
2. **Side Accent Leaves** - Smaller leaves for balance
3. **Geometric Accents** - Diamond shapes for detail
4. **Connecting Lines** - Subtle lines suggesting growth

All elements use geometric shapes (no curves) for a modern, clean aesthetic.

## Best Practices

### ✅ Do

- Use as a background element in full-page layouts
- Keep opacity low (3-7%) for subtlety
- Place content in a relative z-10 container above the pattern
- Use sage green (#6b8e23) for primary sections
- Use terracotta (#d2691e) for success/warm sections
- Use gold (#daa520) for highlight sections

### ❌ Don't

- Don't use high opacity (>10%) - it will distract from content
- Don't animate the pattern - it's designed to be static for performance
- Don't use on small components - it's meant for full-page backgrounds
- Don't layer multiple patterns - use one per section

## Performance Considerations

- **Static SVG**: No animations means minimal CPU usage
- **Lightweight**: Simple geometric shapes keep file size small
- **GPU-Accelerated**: Positioned absolutely with no layout thrashing
- **Scalable**: SVG scales perfectly on all screen sizes

## Accessibility

- **Non-Interactive**: `pointer-events-none` ensures it doesn't interfere with user interactions
- **Low Contrast**: Subtle opacity ensures it doesn't affect text readability
- **No Motion**: Static pattern respects `prefers-reduced-motion`

## Integration with Aloe Design System

The AloePattern is part of the "Agile Aloe" design system:

- **AloeBloom**: Success animation (geometric flower)
- **AloeRoot**: Security/persistence visual (interlocking roots)
- **AloeGrowthPulse**: AI processing indicator (breathing pulse)
- **AloePattern**: Background texture (leaf structure)

All components share the same geometric, culturally meaningful aesthetic.

## Example Layouts

### HomePage Background

```tsx
<div className="relative min-h-screen overflow-hidden bg-space-dark">
  <AloePattern />
  <div className="relative z-10 container mx-auto px-4">
    <h1>Voice to Invoice</h1>
    <VoiceRecorder />
  </div>
</div>
```

### Section Background

```tsx
<section className="relative py-20 bg-space-medium">
  <AloePattern opacity={0.03} color="#d2691e" />
  <div className="relative z-10 container mx-auto">
    <h2>Success Stories</h2>
    {/* Content */}
  </div>
</section>
```

### Modal Background

```tsx
<Modal>
  <div className="relative p-6 bg-space-dark rounded-lg">
    <AloePattern opacity={0.04} />
    <div className="relative z-10">
      <h3>Settings</h3>
      {/* Modal content */}
    </div>
  </div>
</Modal>
```

## Testing

The component includes comprehensive tests:

- ✅ Renders without crashing
- ✅ Applies default opacity (5%)
- ✅ Applies custom opacity
- ✅ Applies custom color
- ✅ Applies custom className
- ✅ Has pointer-events-none
- ✅ Contains aloe-pattern definition
- ✅ Is positioned absolutely

Run tests:
```bash
npm test -- src/components/__tests__/AloePattern.test.tsx --run
```

## Browser Support

Works in all modern browsers that support:
- SVG (99%+ support)
- CSS absolute positioning (100% support)
- CSS opacity (100% support)

No fallbacks needed.

## Task Completion

This component completes **Task 4.4** of the futuristic theming overhaul:

- ✅ Design SVG pattern inspired by aloe leaf structure
- ✅ Very subtle (5% opacity)
- ✅ Static (no animation) for performance
- ✅ Export as reusable component
- ✅ Requirements 5.1, 5.2 satisfied

## Related Documentation

- [ALOE_COMPONENTS_USAGE.md](./ALOE_COMPONENTS_USAGE.md) - Overview of all Aloe components
- [ALOE_ROOT_USAGE.md](./ALOE_ROOT_USAGE.md) - AloeRoot component details
- Design Document: `.kiro/specs/futuristic-theming-overhaul/design.md`
