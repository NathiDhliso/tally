# Aloe Design System Components

## Overview

The Aloe Design System is a culturally meaningful, geometric design system based on the Aloe plant—a symbol of resilience, stability, and South African heritage. This system provides unique visual components that differentiate the Voice-to-Invoice app from generic fintech applications.

## Why the Aloe Metaphor?

1. **Resonance with FinTech Values**: Aloe represents resilience, self-sufficiency, and deep reserves (data persistence)
2. **South African Context**: Native to Southern Africa, authentic to ZAR market
3. **Geometric Clarity**: Simple, clean shapes avoid clutter while maintaining visual interest
4. **Symbolic Mapping**: Each feature maps to an Aloe element

## Components

### 1. AloeBloom

**Purpose**: Success animation that provides instant gratification and confirmation.

**Design Features**:
- Geometric aloe flower with 6 pointed petals
- Terracotta-to-gold gradient (#d2691e → #daa520)
- Quick bloom animation (0.8s total)
- Staggered petal animation (0.05s delay each)
- Ambient glow effect
- Low-poly aesthetic with soft shadows

**Usage**:
```tsx
import { AloeBloom } from '@/components';

// Basic usage
<AloeBloom />

// With callback
<AloeBloom 
  onComplete={() => console.log('Bloom complete!')}
  size={300}
/>
```

**Props**:
- `onComplete?: () => void` - Callback fired when animation completes
- `size?: number` - Size in pixels (default: 200)

**When to Use**:
- Invoice successfully submitted
- Data saved confirmation
- Task completion celebrations
- Success states that deserve emphasis

---

### 2. AloeRoot

**Purpose**: Visual representation of data persistence, security, and foundation.

**Design Features**:
- Geometric, interlocking root structure (9 segments)
- Deep sage green gradient (#6b8e23 → #4a6619)
- Growth animation with spring physics
- Subtle glow effects
- Low-poly aesthetic with soft shadows
- Highlight accents on key nodes

**Usage**:
```tsx
import { AloeRoot } from '@/components';

// Static decorative element
<AloeRoot />

// Animated (e.g., when data is saved)
<AloeRoot 
  animate={true}
  size={300}
  className="my-custom-class"
/>
```

**Props**:
- `animate?: boolean` - Enable growth animation (default: false)
- `size?: number` - Size in pixels (default: 300)
- `className?: string` - Additional CSS classes

**When to Use**:
- Security sections
- Data persistence indicators
- Settings pages (footer decoration)
- Trust/reliability messaging
- Background decoration for stable features

---

### 3. AloeGrowthPulse

**Purpose**: Visual feedback during AI processing and voice recognition.

**Design Features**:
- Breathing animation (2s cycle)
- Sage green → warm gold color transition
- Geometric ripple effects (hexagonal and diamond shapes)
- Particle accents
- Absolute positioned overlay (non-intrusive)

**Usage**:
```tsx
import { AloeGrowthPulse } from '@/components';

// During AI processing
<div className="relative">
  <VoiceRecorder />
  {isProcessing && <AloeGrowthPulse size={200} />}
</div>
```

**Props**:
- `size?: number` - Size in pixels (default: 200)
- `className?: string` - Additional CSS classes

**When to Use**:
- Voice recorder processing state
- AI/LLM processing indicators
- Loading states that need personality
- Background for "thinking" states

---

### 4. AloePattern

**Purpose**: Subtle background texture that reinforces the Aloe theme.

**Design Features**:
- Repeating geometric pattern inspired by aloe leaf structure
- Very subtle (5% opacity by default)
- Static (no animation) for performance
- Customizable color and opacity
- SVG-based for crisp rendering

**Usage**:
```tsx
import { AloePattern } from '@/components';

// Default sage green pattern
<div className="relative min-h-screen bg-space-dark">
  <AloePattern />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>

// Custom color and opacity
<AloePattern 
  color="#daa520" 
  opacity={0.08}
  className="custom-class"
/>
```

**Props**:
- `className?: string` - Additional CSS classes
- `opacity?: number` - Pattern opacity (default: 0.05)
- `color?: string` - Pattern color (default: '#6b8e23' sage green)

**When to Use**:
- Page backgrounds
- Section backgrounds
- Hero sections
- Any area needing subtle texture

---

## Color Palette

The Aloe Design System uses a carefully selected color palette:

### Sage Green (Stability, Primary Actions)
- `#6b8e23` - Primary sage
- `#8ba888` - Light sage (highlights)
- `#5a7a1e` - Medium sage
- `#4a6619` - Deep sage

### Terracotta (Success, Warmth)
- `#d2691e` - Primary terracotta
- `#e8a87c` - Light terracotta
- `#b8591a` - Medium terracotta

### Warm Gold (Highlights, Accents)
- `#daa520` - Primary gold
- `#f4d03f` - Light gold
- `#c19420` - Medium gold

### Deep Space (Backgrounds)
- `#0f172a` - Primary background
- `#1e293b` - Medium background
- `#334155` - Light background

---

## Feature-to-Aloe Mapping

| MVP Feature | Aloe Element | Visual Component |
|-------------|--------------|------------------|
| End-to-End Workflow < 30s | The Bloom | `AloeBloom` - Quick success animation |
| Local Data Persistence | Root System | `AloeRoot` - Foundation and security |
| Voice (Whisper/LLM) | Growth Pulse | `AloeGrowthPulse` - AI processing indicator |
| Overall Theme | Leaf Pattern | `AloePattern` - Background texture |

---

## Performance Considerations

All Aloe components are optimized for performance:

1. **SVG-Based**: Scalable and lightweight
2. **Hardware Acceleration**: Uses CSS transforms and opacity
3. **Reduced Motion Support**: Respects `prefers-reduced-motion`
4. **Static Patterns**: Background patterns have no animation
5. **Conditional Rendering**: Animations only when needed

---

## Accessibility

- All components respect `prefers-reduced-motion` media query
- SVG elements are semantic and screen-reader friendly
- Color contrast ratios meet WCAG AA standards
- No essential information conveyed by animation alone

---

## Testing

All components have comprehensive test coverage:
- `AloeBloom.test.tsx` - 10 tests
- `AloeRoot.test.tsx` - 8 tests
- `AloeGrowthPulse.test.tsx` - 7 tests
- `AloePattern.test.tsx` - 8 tests

Run tests:
```bash
npm test -- src/components/__tests__/Aloe*.test.tsx --run
```

---

## Examples

### Success Flow with AloeBloom
```tsx
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async () => {
  await submitInvoice();
  setShowSuccess(true);
};

return (
  <>
    {showSuccess && (
      <AloeBloom 
        onComplete={() => navigate('/invoices')}
      />
    )}
  </>
);
```

### Security Section with AloeRoot
```tsx
<section className="relative p-8 bg-space-dark rounded-lg">
  <AloeRoot 
    animate={dataSaved}
    size={200}
    className="absolute bottom-4 right-4 opacity-20"
  />
  <h2>Data Security</h2>
  <p>Your data is stored locally and encrypted.</p>
</section>
```

### Voice Processing with AloeGrowthPulse
```tsx
<div className="relative">
  <button className="voice-button">
    <MicrophoneIcon />
  </button>
  {isProcessing && (
    <AloeGrowthPulse size={150} />
  )}
</div>
```

### Page Background with AloePattern
```tsx
<div className="relative min-h-screen bg-space-dark">
  <AloePattern opacity={0.05} />
  <div className="relative z-10 container mx-auto">
    {/* Page content */}
  </div>
</div>
```

---

## Design Philosophy

The Aloe Design System embodies:

1. **Cultural Authenticity**: Uniquely South African
2. **Symbolic Depth**: Each element has meaning
3. **Performance**: Lightweight and optimized
4. **Accessibility**: Works for everyone
5. **Clarity**: Geometric simplicity over complexity

This creates a premium, trustworthy, and distinctly South African fintech experience for 2025.
