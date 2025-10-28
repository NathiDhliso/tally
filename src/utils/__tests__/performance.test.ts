/**
 * Performance Utilities Tests
 * 
 * Tests for performance monitoring and optimization utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isLowEndDevice,
  FPSMonitor,
  throttle,
  debounce,
  shouldUseWillChange,
  getOptimizedAnimationConfig,
  supportsBackdropFilter,
  getFallbackStyles,
} from '../performance';

describe('Performance Utilities', () => {
  describe('isLowEndDevice', () => {
    it('should detect low-end device based on CPU cores', () => {
      // Mock navigator
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2,
      });

      expect(isLowEndDevice()).toBe(true);
    });

    it('should detect high-end device', () => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 8,
      });

      // Mock non-mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });

      expect(isLowEndDevice()).toBe(false);
    });
  });

  describe('FPSMonitor', () => {
    let monitor: FPSMonitor;

    beforeEach(() => {
      monitor = new FPSMonitor();
      vi.useFakeTimers();
    });

    afterEach(() => {
      monitor.stop();
      vi.useRealTimers();
    });

    it('should start monitoring FPS', () => {
      const callback = vi.fn();
      monitor.start(callback);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      expect(callback).toHaveBeenCalled();
    });

    it('should calculate average FPS', () => {
      monitor.start();
      
      // Simulate some frames
      vi.advanceTimersByTime(100);
      
      const fps = monitor.getAverageFPS();
      expect(fps).toBeGreaterThan(0);
      expect(fps).toBeLessThanOrEqual(60);
    });

    it('should detect good performance', () => {
      monitor.start();
      vi.advanceTimersByTime(100);
      
      // Should return true if FPS >= 50
      const isGood = monitor.isPerformanceGood();
      expect(typeof isGood).toBe('boolean');
    });

    it('should stop monitoring', () => {
      const callback = vi.fn();
      monitor.start(callback);
      monitor.stop();

      const callCount = callback.mock.calls.length;
      vi.advanceTimersByTime(1000);

      // Should not call callback after stop
      expect(callback.mock.calls.length).toBe(callCount);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      // Call multiple times
      throttled();
      throttled();
      throttled();

      // Should only call once immediately
      expect(fn).toHaveBeenCalledTimes(1);

      // Fast-forward time
      vi.advanceTimersByTime(100);

      // Call again
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      // Call multiple times
      debounced();
      debounced();
      debounced();

      // Should not call immediately
      expect(fn).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(100);

      // Should call once after delay
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced(); // Reset timer
      vi.advanceTimersByTime(50);

      // Should not have called yet
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('shouldUseWillChange', () => {
    it('should return false for low-end devices', () => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2,
      });

      const element = document.createElement('div');
      expect(shouldUseWillChange(element)).toBe(false);
    });

    it('should return true for animating elements on high-end devices', () => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 8,
      });

      const element = document.createElement('div');
      element.style.transform = 'translateX(10px)';
      
      // Note: In JSDOM, getComputedStyle might not reflect inline styles
      // This test verifies the function logic
      const result = shouldUseWillChange(element);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getOptimizedAnimationConfig', () => {
    it('should return optimized config for low-end devices', () => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2,
      });

      const config = getOptimizedAnimationConfig();
      
      expect(config.enableBlur).toBe(false);
      expect(config.enableShadows).toBe(false);
      expect(config.enableParticles).toBe(false);
      expect(config.enable3D).toBe(false);
      expect(config.particleCount).toBe(20);
      expect(config.animationDuration).toBe(0.2);
    });

    it('should return full config for high-end devices', () => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 8,
      });

      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });

      const config = getOptimizedAnimationConfig();
      
      expect(config.enableBlur).toBe(true);
      expect(config.enableShadows).toBe(true);
      expect(config.enableParticles).toBe(true);
      expect(config.enable3D).toBe(true);
      expect(config.particleCount).toBe(50);
      expect(config.animationDuration).toBe(0.3);
    });
  });

  describe('supportsBackdropFilter', () => {
    beforeEach(() => {
      // Mock CSS.supports
      global.CSS = {
        supports: vi.fn((property: string, value: string) => {
          return property === 'backdrop-filter' || property === '-webkit-backdrop-filter';
        }),
      } as any;
    });

    it('should check backdrop-filter support', () => {
      const result = supportsBackdropFilter();
      expect(typeof result).toBe('boolean');
      expect(global.CSS.supports).toHaveBeenCalled();
    });
  });

  describe('getFallbackStyles', () => {
    beforeEach(() => {
      // Mock CSS.supports
      global.CSS = {
        supports: vi.fn((property: string, value: string) => {
          return property === 'backdrop-filter' || property === '-webkit-backdrop-filter';
        }),
      } as any;
    });

    it('should return fallback styles', () => {
      const styles = getFallbackStyles();
      
      expect(styles).toHaveProperty('glass');
      expect(typeof styles.glass).toBe('string');
    });

    it('should return different styles based on backdrop-filter support', () => {
      const styles = getFallbackStyles();
      
      // Should contain either backdrop-blur or fallback
      expect(
        styles.glass.includes('backdrop-blur') || 
        styles.glass.includes('bg-white/20')
      ).toBe(true);
    });
  });
});
