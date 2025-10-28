/**
 * Performance Monitoring and Optimization Utilities
 * 
 * Provides utilities for monitoring FPS, detecting low-end devices,
 * and optimizing animations based on performance.
 */

// Detect if device is low-end
export const isLowEndDevice = (): boolean => {
  // Check hardware concurrency (CPU cores)
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Check device memory (if available)
  const lowMemory = 'deviceMemory' in navigator && 
    (navigator as any).deviceMemory < 4;
  
  return lowCPU || (isMobile && lowMemory);
};

// FPS Monitor
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private rafId: number | null = null;
  
  start(callback?: (fps: number) => void): void {
    const measure = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      this.lastTime = now;
      
      const fps = 1000 / delta;
      this.frames.push(fps);
      
      // Keep only last 60 frames
      if (this.frames.length > 60) {
        this.frames.shift();
      }
      
      if (callback) {
        callback(this.getAverageFPS());
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    this.rafId = requestAnimationFrame(measure);
  }
  
  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  getAverageFPS(): number {
    if (this.frames.length === 0) return 60;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }
  
  isPerformanceGood(): boolean {
    return this.getAverageFPS() >= 50;
  }
}

// Throttle function for expensive operations
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Check if will-change should be applied
export const shouldUseWillChange = (element: HTMLElement): boolean => {
  // Don't use will-change on low-end devices
  if (isLowEndDevice()) return false;
  
  // Check if element is currently animating
  const computedStyle = window.getComputedStyle(element);
  const transform = computedStyle.transform;
  const opacity = computedStyle.opacity;
  
  return transform !== 'none' || parseFloat(opacity) < 1;
};

// Optimize animation based on performance
export const getOptimizedAnimationConfig = () => {
  const isLowEnd = isLowEndDevice();
  
  return {
    // Reduce animation complexity on low-end devices
    enableBlur: !isLowEnd,
    enableShadows: !isLowEnd,
    enableParticles: !isLowEnd,
    enable3D: !isLowEnd,
    particleCount: isLowEnd ? 20 : 50,
    animationDuration: isLowEnd ? 0.2 : 0.3,
  };
};

// Request Idle Callback polyfill
export const requestIdleCallback =
  window.requestIdleCallback ||
  function(cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1) as any;
  };

export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function(id: number) {
    clearTimeout(id);
  };

// Measure component render time
export const measureRenderTime = (componentName: string, callback: () => void): void => {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16.67) { // More than one frame at 60fps
    console.warn(`${componentName} render took ${duration.toFixed(2)}ms (> 16.67ms)`);
  }
};

// Check backdrop-filter support
export const supportsBackdropFilter = (): boolean => {
  return CSS.supports('backdrop-filter', 'blur(10px)') ||
         CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
};

// Get fallback styles for unsupported features
export const getFallbackStyles = () => {
  const hasBackdropFilter = supportsBackdropFilter();
  
  return {
    glass: hasBackdropFilter
      ? 'backdrop-blur-xl bg-white/10'
      : 'bg-white/20', // Slightly more opaque without blur
  };
};
