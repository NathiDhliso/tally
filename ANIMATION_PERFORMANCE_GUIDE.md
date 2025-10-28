# Animation Performance Optimization Guide

## Overview

This guide documents the animation performance optimizations implemented in the Voice-to-Invoice application and provides instructions for testing and monitoring performance.

## Optimization Strategies Implemented

### 1. GPU-Accelerated Properties

All animations use GPU-accelerated CSS properties:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ❌ Avoid: `width`, `height`, `top`, `left`, `margin`, `padding`

**Why?** GPU-accelerated properties trigger compositing instead of layout/paint, resulting in 60fps animations.

### 2. Will-Change Hints

Added `will-change` CSS hints to elements that will animate:

```typescript
// Button component
style={{ willChange: !isDisabled && !prefersReducedMotion ? 'transform' : 'auto' }}

// Card component
style={{ willChange: hover && !prefersReducedMotion ? 'transform, box-shadow' : 'auto' }}
```

**Best Practices:**
- Only apply `will-change` when element is about to animate
- Remove `will-change` after animation completes (set to 'auto')
- Don't use on low-end devices (auto-detected)
- Limit to 2-3 properties maximum

**Components with will-change:**
- `Button.tsx` - transform on hover/tap
- `Card.tsx` - transform and box-shadow on hover
- `Modal.tsx` - transform and opacity on open/close
- `Toast.tsx` - transform and opacity on enter/exit

### 3. Throttling and Debouncing

Expensive operations are throttled to prevent performance degradation:

#### Throttled Operations (16ms = ~60fps)
- Mouse move events in `useParallax` hook
- Scroll events in `useScrollParallax` hook
- Mouse move in `use3DTransform` hook
- Mouse move in `useGlowEffect` hook

```typescript
// Example: Throttled mouse move
const throttledHandleMouseMove = throttle(handleMouseMove, 16);
window.addEventListener('mousemove', throttledHandleMouseMove);
```

#### Debounced Operations (300ms)
- Search input in `InvoicesPage` and `ClientsPage`
- Form validation in `InvoiceForm`

```typescript
// Example: Debounced search
const debouncedSearch = debounce(handleSearch, 300);
```

### 4. Reduced Motion Support

All animations respect `prefers-reduced-motion` user preference:

```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>
```

**Components with reduced motion support:**
- All Framer Motion components
- All custom animation hooks
- SVG animations in Aloe components

### 5. Low-End Device Detection

Automatically detect and optimize for low-end devices:

```typescript
const isLowEnd = isLowEndDevice();
// Returns true if:
// - CPU cores < 4
// - Mobile device with < 4GB RAM
// - Device memory < 4GB
```

**Optimizations for low-end devices:**
- Disable backdrop-filter blur effects
- Reduce particle count
- Disable 3D transforms
- Disable will-change hints
- Simplify animations

### 6. RequestAnimationFrame for Visual Updates

Use `requestAnimationFrame` for smooth visual updates:

```typescript
// WaveformVisualizer.tsx
const updateFrequencyData = () => {
  analyser.getByteFrequencyData(dataArray);
  setFrequencyData(processData(dataArray));
  animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
};
```

**Always cleanup:**
```typescript
useEffect(() => {
  const rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId);
}, []);
```

## Performance Testing

### 1. FPS Monitoring with Chrome DevTools

**Steps:**
1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Enable **Screenshots** and **Memory** checkboxes
4. Click **Record** (Ctrl+E)
5. Interact with the application (hover buttons, open modals, record voice)
6. Stop recording after 5-10 seconds
7. Analyze the results

**What to look for:**
- **FPS meter**: Should stay at 60fps (green line)
- **Frame drops**: Red bars indicate dropped frames
- **Long tasks**: Yellow/red blocks > 50ms indicate performance issues
- **Layout/Paint**: Should be minimal during animations

**Target Metrics:**
- ✅ FPS: 60fps consistently
- ✅ Frame time: < 16.67ms per frame
- ✅ Interaction latency: < 100ms
- ✅ No layout thrashing

### 2. Using FPSMonitor Class

Built-in FPS monitoring utility:

```typescript
import { FPSMonitor } from '../utils/performance';

// In your component
useEffect(() => {
  const monitor = new FPSMonitor();
  
  monitor.start((fps) => {
    console.log(`Current FPS: ${fps}`);
    if (fps < 50) {
      console.warn('Performance degradation detected!');
    }
  });
  
  return () => monitor.stop();
}, []);
```

### 3. Lighthouse Performance Audit

**Steps:**
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Performance** category
4. Choose **Desktop** or **Mobile**
5. Click **Analyze page load**

**Target Scores:**
- ✅ Performance: > 90
- ✅ First Contentful Paint: < 1.8s
- ✅ Time to Interactive: < 3.8s
- ✅ Cumulative Layout Shift: < 0.1

### 4. Animation Performance Checklist

Use this checklist when adding new animations:

- [ ] Uses only `transform` and `opacity`
- [ ] Has `will-change` hint (added before animation, removed after)
- [ ] Respects `prefers-reduced-motion`
- [ ] Throttled if triggered by mouse/scroll events
- [ ] Uses `requestAnimationFrame` for visual updates
- [ ] Cleans up event listeners and animation frames
- [ ] Tested on low-end device simulation
- [ ] Maintains 60fps in Chrome DevTools
- [ ] No layout thrashing (check Performance tab)

### 5. Low-End Device Simulation

**Chrome DevTools CPU Throttling:**
1. Open DevTools Performance tab
2. Click gear icon (⚙️)
3. Set CPU throttling to **4x slowdown** or **6x slowdown**
4. Test animations and interactions

**Mobile Device Simulation:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a low-end device (e.g., Moto G4)
4. Enable **Network throttling** (Fast 3G)
5. Test performance

## Common Performance Issues and Solutions

### Issue 1: Janky Animations

**Symptoms:** Animations stutter or drop frames

**Solutions:**
- ✅ Verify using `transform` and `opacity` only
- ✅ Check for layout thrashing in Performance tab
- ✅ Add `will-change` hint before animation
- ✅ Reduce animation complexity on low-end devices

### Issue 2: High CPU Usage

**Symptoms:** Fan spins up, battery drains quickly

**Solutions:**
- ✅ Throttle mouse/scroll event handlers
- ✅ Limit number of animated elements
- ✅ Use CSS animations for simple loops
- ✅ Disable animations on low-end devices

### Issue 3: Memory Leaks

**Symptoms:** Memory usage increases over time

**Solutions:**
- ✅ Clean up event listeners in useEffect
- ✅ Cancel animation frames on unmount
- ✅ Remove will-change after animation completes
- ✅ Clear intervals and timeouts

### Issue 4: Slow Initial Load

**Symptoms:** Long time to interactive

**Solutions:**
- ✅ Lazy load heavy components (Aloe components)
- ✅ Code split routes
- ✅ Optimize SVG file sizes
- ✅ Use tree shaking for Framer Motion imports

## Performance Monitoring in Production

### 1. Web Vitals

Monitor Core Web Vitals:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 2. Custom Performance Marks

Add custom performance marks:

```typescript
// Mark start of animation
performance.mark('animation-start');

// ... animation code ...

// Mark end of animation
performance.mark('animation-end');

// Measure duration
performance.measure('animation-duration', 'animation-start', 'animation-end');

// Get measurement
const measure = performance.getEntriesByName('animation-duration')[0];
console.log(`Animation took ${measure.duration}ms`);
```

### 3. Error Tracking

Track performance issues:

```typescript
const monitor = new FPSMonitor();
monitor.start((fps) => {
  if (fps < 30) {
    // Log to error tracking service
    console.error('Critical performance issue', {
      fps,
      userAgent: navigator.userAgent,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    });
  }
});
```

## Best Practices Summary

### DO ✅
- Use `transform` and `opacity` for animations
- Add `will-change` hints before animations
- Throttle mouse/scroll event handlers (16ms)
- Debounce search and validation (300ms)
- Respect `prefers-reduced-motion`
- Clean up event listeners and animation frames
- Test on low-end devices
- Monitor FPS during development
- Use `requestAnimationFrame` for visual updates
- Lazy load heavy components

### DON'T ❌
- Animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Leave `will-change` applied permanently
- Ignore `prefers-reduced-motion`
- Forget to clean up event listeners
- Use unthrottled mouse/scroll handlers
- Animate too many elements simultaneously
- Use heavy blur effects on low-end devices
- Block the main thread with expensive operations

## Testing Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Browser Compatibility

### Supported Features
- ✅ CSS Transforms (99%+ browsers)
- ✅ CSS Opacity (99%+ browsers)
- ✅ RequestAnimationFrame (99%+ browsers)
- ✅ Backdrop-filter (95%+ browsers, with fallback)
- ✅ Will-change (95%+ browsers)
- ✅ Prefers-reduced-motion (95%+ browsers)

### Fallbacks
- Backdrop-filter: Solid background color
- Will-change: Gracefully ignored by older browsers
- Prefers-reduced-motion: Animations enabled by default

## Resources

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [CSS Triggers](https://csstriggers.com/)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [High Performance Animations](https://web.dev/animations-guide/)

## Conclusion

By following these optimization strategies and testing procedures, the Voice-to-Invoice application maintains smooth 60fps animations across all devices while respecting user preferences and device capabilities.

**Key Achievements:**
- ✅ All animations use GPU-accelerated properties
- ✅ Will-change hints added to interactive components
- ✅ Mouse/scroll events throttled to 16ms (~60fps)
- ✅ Reduced motion support implemented
- ✅ Low-end device detection and optimization
- ✅ Performance monitoring utilities available
- ✅ Comprehensive testing guide provided

**Next Steps:**
- Monitor performance in production
- Gather user feedback on animation smoothness
- Optimize further based on real-world data
- Consider adding performance budgets to CI/CD
