import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AloeSpinner } from '../AloeSpinner';

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('AloeSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<AloeSpinner />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders with default size of 48', () => {
    const { container } = render(<AloeSpinner />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('height')).toBe('48');
  });

  it('renders with custom size', () => {
    const { container } = render(<AloeSpinner size={64} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('64');
    expect(svg?.getAttribute('height')).toBe('64');
  });

  it('applies custom className', () => {
    const { container } = render(<AloeSpinner className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('custom-class')).toBe(true);
  });

  it('renders gradient definition', () => {
    const { container } = render(<AloeSpinner />);
    const gradient = container.querySelector('#aloe-spinner-gradient');
    expect(gradient).toBeTruthy();
  });

  it('renders hexagonal path', () => {
    const { container } = render(<AloeSpinner />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('renders 6 aloe leaf points', () => {
    const { container } = render(<AloeSpinner />);
    const paths = container.querySelectorAll('path');
    // 1 hexagon + 6 leaf points = 7 paths
    expect(paths.length).toBe(7);
  });

  it('uses sage-to-gold gradient colors', () => {
    const { container } = render(<AloeSpinner />);
    const gradient = container.querySelector('#aloe-spinner-gradient');
    const stops = gradient?.querySelectorAll('stop');
    
    expect(stops?.[0]?.getAttribute('stop-color')).toBe('#6b8e23'); // Sage
    expect(stops?.[1]?.getAttribute('stop-color')).toBe('#daa520'); // Gold
    expect(stops?.[2]?.getAttribute('stop-color')).toBe('#6b8e23'); // Sage
  });
});
