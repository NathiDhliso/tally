# Aloe Design System Components - Usage Guide

## Quick Reference

### AloeBloom - Success Animation

```tsx
import { AloeBloom } from './components/AloeBloom';

// Basic usage
<AloeBloom />

// With callback and custom size
<AloeBloom 
  size={300} 
  onComplete={() => console.log('Animation complete!')} 
/>
```

**When to use**: Success confirmations, invoice submission, data saved

**Animation**: 0.8s bloom with spring physics, terracotta-to-gold gradient

---

### AloeRoot - Data Persistence Visual

```tsx
import { AloeRoot } from './components/AloeRoot';

// Static decorative
<AloeRoot />

// Animated (when data is saved)
<AloeRoot animate={true} size={250} />

// With custom styling
<AloeRoot className="opacity-50" />
```

**When to use**: Security sections, settings page, data persistence indicators

**Animation**: Growth animation with pulsing nodes (when animate=true)

---

### AloeGrowthPulse - AI Processing Indicator

```tsx
import { AloeGrowthPulse } from './components/AloeGrowthPulse';

// Overlay on VoiceRecorder
<div className="relative">
  <VoiceRecorder />
  {isProcessing && <AloeGrowthPulse size={200} />}
</div>

// Custom size
<AloeGrowthPulse size={300} className="z-10" />
```

**When to use**: AI processing states, voice recorder processing, loading with personality

**Animation**: 2s breathing cycle, sage → gold color transition, geometric ripples

---

### AloePattern - Background Texture

```tsx
import { AloePattern } from './components/AloePattern';

// Default (5% opacity, sage color)
<div className="relative min-h-screen bg-space-dark">
  <AloePattern />
  <div className="relative z-10">{/* Your content */}</div>
</div>

// Custom opacity and color
<AloePattern opacity={0.08} color="#8ba888" />

// With custom classes
<AloePattern className="fixed inset-0" />
```

**When to use**: Page backgrounds, section backgrounds, subtle texture

**Animation**: None (static for performance)

---

## Component Combinations

### Success Flow
```tsx
// Invoice submitted successfully
<div className="flex items-center justify-center">
  <AloeBloom 
    size={250}
    onComplete={() => {
      // Navigate to next page or show confirmation
    }}
  />
</div>
```

### Processing State
```tsx
// Voice recorder processing
<div className="relative">
  <button className="w-32 h-32 rounded-full">
    <MicrophoneIcon />
  </button>
  {isProcessing && <AloeGrowthPulse size={200} />}
</div>
```

### Page Background
```tsx
// HomePage with pattern
<div className="relative min-h-screen bg-space-dark">
  <AloePattern opacity={0.05} />
  <div className="relative z-10">
    {/* Page content */}
  </div>
</div>
```

### Settings Security Section
```tsx
// Settings page with root visual
<section className="glass-card p-8">
  <div className="flex items-center gap-6">
    <AloeRoot size={150} animate={dataSaved} />
    <div>
      <h3>Data Security</h3>
      <p>Your data is stored locally and encrypted</p>
    </div>
  </div>
</section>
```

---

## Design Tokens

All components use the Aloe color palette:

```typescript
// From src/theme/colors.ts
sage: {
  500: '#6b8e23', // Primary sage
  600: '#5a7a1e',
  700: '#4a6619',
}

terracotta: {
  500: '#d2691e', // Primary terracotta
  600: '#b8591a',
}

gold: {
  500: '#daa520', // Primary gold
}
```

---

## Accessibility

All components:
- ✅ Respect `prefers-reduced-motion`
- ✅ Use `pointer-events-none` for overlays
- ✅ Provide semantic SVG structure
- ✅ Work without JavaScript (static fallback)

---

## Performance Notes

- **AloeBloom**: Lightweight SVG animation, 0.8s duration
- **AloeRoot**: Minimal DOM nodes, optional animation
- **AloeGrowthPulse**: GPU-accelerated transforms, 2s cycle
- **AloePattern**: Static SVG pattern, no animation overhead

All components maintain 60fps on modern devices.

---

## Cultural Context

The Aloe plant is native to Southern Africa and symbolizes:
- **Resilience** (thrives in harsh conditions)
- **Reserves** (stores water/nutrients)
- **Healing** (traditional medicinal uses)
- **Growth** (steady, reliable)

These components bring cultural authenticity to the Voice-to-Invoice app, differentiating it from generic fintech solutions.
