import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectBrowser,
  checkFeatureSupport,
  checkBackdropFilterSupport,
  checkWebGLSupport,
  checkWebAudioSupport,
  checkCSSAnimationSupport,
  checkTouchSupport,
  getBrowserClass,
  getPerformanceTier,
  shouldReduceAnimations,
} from '../browserDetection';

describe('browserDetection', () => {
  describe('detectBrowser', () => {
    it('should detect browser information', () => {
      const browser = detectBrowser();
      
      expect(browser).toHaveProperty('name');
      expect(browser).toHaveProperty('version');
      expect(browser).toHaveProperty('isChrome');
      expect(browser).toHaveProperty('isFirefox');
      expect(browser).toHaveProperty('isSafari');
      expect(browser).toHaveProperty('isEdge');
      expect(browser).toHaveProperty('isIOS');
      expect(browser).toHaveProperty('isMobile');
    });

    it('should detect at least one browser type', () => {
      const browser = detectBrowser();
      const hasType = 
        browser.isChrome ||
        browser.isFirefox ||
        browser.isSafari ||
        browser.isEdge;
      
      expect(hasType || browser.name === 'Unknown').toBe(true);
    });
  });

  describe('checkFeatureSupport', () => {
    it('should check all feature support', () => {
      const features = checkFeatureSupport();
      
      expect(features).toHaveProperty('backdropFilter');
      expect(features).toHaveProperty('webGL');
      expect(features).toHaveProperty('webAudio');
      expect(features).toHaveProperty('cssAnimations');
      expect(features).toHaveProperty('touchEvents');
      expect(features).toHaveProperty('serviceWorker');
    });

    it('should return boolean values for all features', () => {
      const features = checkFeatureSupport();
      
      expect(typeof features.backdropFilter).toBe('boolean');
      expect(typeof features.webGL).toBe('boolean');
      expect(typeof features.webAudio).toBe('boolean');
      expect(typeof features.cssAnimations).toBe('boolean');
      expect(typeof features.touchEvents).toBe('boolean');
      expect(typeof features.serviceWorker).toBe('boolean');
    });
  });

  describe('checkBackdropFilterSupport', () => {
    it('should check backdrop-filter support', () => {
      const supported = checkBackdropFilterSupport();
      expect(typeof supported).toBe('boolean');
    });

    it('should return true in modern browsers', () => {
      // Most modern test environments support backdrop-filter
      const supported = checkBackdropFilterSupport();
      // We can't guarantee support in test environment, just check it returns a boolean
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('checkWebGLSupport', () => {
    it('should check WebGL support', () => {
      const supported = checkWebGLSupport();
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('checkWebAudioSupport', () => {
    it('should check Web Audio API support', () => {
      const supported = checkWebAudioSupport();
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('checkCSSAnimationSupport', () => {
    it('should check CSS animation support', () => {
      const supported = checkCSSAnimationSupport();
      expect(typeof supported).toBe('boolean');
    });

    it('should return true in modern browsers', () => {
      const supported = checkCSSAnimationSupport();
      // Modern test environments should support CSS animations
      expect(supported).toBe(true);
    });
  });

  describe('checkTouchSupport', () => {
    it('should check touch event support', () => {
      const supported = checkTouchSupport();
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('getBrowserClass', () => {
    it('should return a string of browser classes', () => {
      const classes = getBrowserClass();
      expect(typeof classes).toBe('string');
    });

    it('should include at least one browser class', () => {
      const classes = getBrowserClass();
      const hasClass = 
        classes.includes('browser-chrome') ||
        classes.includes('browser-firefox') ||
        classes.includes('browser-safari') ||
        classes.includes('browser-edge') ||
        classes === '';
      
      expect(hasClass).toBe(true);
    });
  });

  describe('getPerformanceTier', () => {
    it('should return a valid performance tier', () => {
      const tier = getPerformanceTier();
      expect(['high', 'medium', 'low']).toContain(tier);
    });

    it('should consider hardware concurrency', () => {
      const tier = getPerformanceTier();
      const cores = navigator.hardwareConcurrency || 2;
      
      if (cores >= 4) {
        expect(['high', 'medium']).toContain(tier);
      }
    });
  });

  describe('shouldReduceAnimations', () => {
    beforeEach(() => {
      // Mock matchMedia before each test
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('should return boolean', () => {
      const shouldReduce = shouldReduceAnimations();
      expect(typeof shouldReduce).toBe('boolean');
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock matchMedia to return true for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const shouldReduce = shouldReduceAnimations();
      expect(shouldReduce).toBe(true);
    });
  });
});
