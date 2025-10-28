import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WaveformVisualizer } from '../WaveformVisualizer';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
  },
}));

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('WaveformVisualizer', () => {
  let mockAnalyser: AnalyserNode;

  beforeEach(() => {
    // Mock AnalyserNode
    mockAnalyser = {
      frequencyBinCount: 256,
      getByteFrequencyData: vi.fn((dataArray: Uint8Array) => {
        // Fill with mock frequency data
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.floor(Math.random() * 255);
        }
      }),
    } as unknown as AnalyserNode;

    // Mock requestAnimationFrame to not call the callback immediately
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
      return 1; // Return a mock frame ID
    });

    // Mock cancelAnimationFrame
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders 32 frequency bars', async () => {
    const { container } = render(
      <WaveformVisualizer audioLevel={50} analyser={mockAnalyser} />
    );

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(32);
  });

  it('renders SVG with correct viewBox', async () => {
    const { container } = render(
      <WaveformVisualizer audioLevel={50} analyser={mockAnalyser} />
    );

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 320 100');
  });

  it('includes gradient definitions', async () => {
    const { container } = render(
      <WaveformVisualizer audioLevel={50} analyser={mockAnalyser} />
    );

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    const sageGradient = container.querySelector('#sage-gradient');
    const goldGradient = container.querySelector('#gold-gradient');
    const terracottaGradient = container.querySelector('#terracotta-gradient');

    expect(sageGradient).toBeTruthy();
    expect(goldGradient).toBeTruthy();
    expect(terracottaGradient).toBeTruthy();
  });

  it('renders fallback bars when no analyser provided', () => {
    const { container } = render(<WaveformVisualizer audioLevel={50} analyser={null} />);

    const bars = container.querySelectorAll('.w-1');
    expect(bars.length).toBe(32);
  });

  it('applies custom className', async () => {
    const { container } = render(
      <WaveformVisualizer audioLevel={50} analyser={mockAnalyser} className="custom-class" />
    );

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    const svg = container.querySelector('svg');
    expect(svg?.className.baseVal).toContain('custom-class');
  });

  it('calls getByteFrequencyData on analyser', async () => {
    render(<WaveformVisualizer audioLevel={50} analyser={mockAnalyser} />);

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockAnalyser.getByteFrequencyData).toHaveBeenCalled();
  });
});
