/**
 * Browser Detection and Feature Support Utilities
 * 
 * Provides utilities for detecting browser capabilities and applying
 * appropriate fallbacks for cross-browser compatibility.
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isIOS: boolean;
  isMobile: boolean;
}

export interface FeatureSupport {
  backdropFilter: boolean;
  webGL: boolean;
  webAudio: boolean;
  cssAnimations: boolean;
  touchEvents: boolean;
  serviceWorker: boolean;
}

/**
 * Detect current browser information
 */
export const detectBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(ua);
  const isSafari = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor);
  const isEdge = /Edg/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  let name = 'Unknown';
  let version = 'Unknown';
  
  if (isEdge) {
    name = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (isChrome) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (isFirefox) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (isSafari) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  
  return {
    name,
    version,
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isIOS,
    isMobile,
  };
};

/**
 * Check feature support across browsers
 */
export const checkFeatureSupport = (): FeatureSupport => {
  return {
    backdropFilter: checkBackdropFilterSupport(),
    webGL: checkWebGLSupport(),
    webAudio: checkWebAudioSupport(),
    cssAnimations: checkCSSAnimationSupport(),
    touchEvents: checkTouchSupport(),
    serviceWorker: 'serviceWorker' in navigator,
  };
};

/**
 * Check if backdrop-filter is supported
 */
export const checkBackdropFilterSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  testElement.style.backdropFilter = 'blur(10px)';
  (testElement.style as any).webkitBackdropFilter = 'blur(10px)';
  
  return (
    testElement.style.backdropFilter === 'blur(10px)' ||
    (testElement.style as any).webkitBackdropFilter === 'blur(10px)'
  );
};

/**
 * Check if WebGL is supported
 */
export const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

/**
 * Check if Web Audio API is supported
 */
export const checkWebAudioSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.AudioContext ||
    (window as any).webkitAudioContext
  );
};

/**
 * Check if CSS animations are supported
 */
export const checkCSSAnimationSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  const animationProperties = [
    'animation',
    'webkitAnimation',
    'MozAnimation',
    'OAnimation',
  ];
  
  return animationProperties.some(
    (prop) => prop in testElement.style
  );
};

/**
 * Check if touch events are supported
 */
export const checkTouchSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * Get appropriate CSS class for browser-specific styling
 */
export const getBrowserClass = (): string => {
  const browser = detectBrowser();
  const classes: string[] = [];
  
  if (browser.isChrome) classes.push('browser-chrome');
  if (browser.isFirefox) classes.push('browser-firefox');
  if (browser.isSafari) classes.push('browser-safari');
  if (browser.isEdge) classes.push('browser-edge');
  if (browser.isIOS) classes.push('browser-ios');
  if (browser.isMobile) classes.push('browser-mobile');
  
  return classes.join(' ');
};

/**
 * Log browser and feature support information (for debugging)
 */
export const logBrowserInfo = (): void => {
  const browser = detectBrowser();
  const features = checkFeatureSupport();
  
  console.group('🌐 Browser Information');
  console.log('Browser:', browser.name, browser.version);
  console.log('Mobile:', browser.isMobile);
  console.log('iOS:', browser.isIOS);
  console.groupEnd();
  
  console.group('✨ Feature Support');
  console.log('Backdrop Filter:', features.backdropFilter ? '✅' : '❌');
  console.log('WebGL:', features.webGL ? '✅' : '❌');
  console.log('Web Audio:', features.webAudio ? '✅' : '❌');
  console.log('CSS Animations:', features.cssAnimations ? '✅' : '❌');
  console.log('Touch Events:', features.touchEvents ? '✅' : '❌');
  console.log('Service Worker:', features.serviceWorker ? '✅' : '❌');
  console.groupEnd();
};

/**
 * Apply browser-specific class to document element
 */
export const applyBrowserClass = (): void => {
  if (typeof document === 'undefined') return;
  
  const browserClass = getBrowserClass();
  document.documentElement.className += ` ${browserClass}`;
};

/**
 * Check if current browser needs webkit prefix for backdrop-filter
 */
export const needsWebkitPrefix = (): boolean => {
  const browser = detectBrowser();
  return browser.isSafari || browser.isIOS;
};

/**
 * Get performance tier based on browser and device
 */
export const getPerformanceTier = (): 'high' | 'medium' | 'low' => {
  const browser = detectBrowser();
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check if mobile
  if (browser.isMobile) {
    // iOS devices generally have good performance
    if (browser.isIOS) {
      return cores >= 4 ? 'high' : 'medium';
    }
    // Android varies widely
    return cores >= 6 ? 'medium' : 'low';
  }
  
  // Desktop browsers
  return cores >= 4 ? 'high' : 'medium';
};

/**
 * Check if browser should use reduced animations
 */
export const shouldReduceAnimations = (): boolean => {
  // Check user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  
  // Check performance tier
  const tier = getPerformanceTier();
  return tier === 'low';
};
