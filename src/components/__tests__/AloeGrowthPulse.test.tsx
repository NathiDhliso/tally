import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AloeGrowthPulse } from '../AloeGrowthPulse';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
  },
}));

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('AloeGrowthPulse', () => {
  it('renders without crashing', () => {
    const { container } = render(<AloeGrowthPulse />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as absolute positioned overlay', () => {
    const { container } = render(<AloeGrowthPulse />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain('absolute');
    expect(wrapper?.className).toContain('inset-0');
    expect(wrapper?.className).toContain('pointer-events-none');
  });

  it('accepts custom size prop', () => {
    const { container } = render(<AloeGrowthPulse size={300} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('accepts custom className prop', () => {
    const { container } = render(<AloeGrowthPulse className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain('custom-class');
  });

  it('renders SVG elements for geometric ripples', () => {
    const { container } = render(<AloeGrowthPulse />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('includes gradient definition for sage to gold transition', () => {
    const { container } = render(<AloeGrowthPulse />);
    const gradient = container.querySelector('#pulse-gradient');
    expect(gradient).toBeTruthy();
  });

  it('renders hexagonal and diamond geometric shapes', () => {
    const { container } = render(<AloeGrowthPulse />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });
});
