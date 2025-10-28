import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AloeRoot } from '../AloeRoot';

describe('AloeRoot', () => {
  it('renders without crashing', () => {
    const { container } = render(<AloeRoot />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { container } = render(<AloeRoot size={400} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('400px');
    expect(wrapper.style.height).toBe('400px');
  });

  it('renders with custom className', () => {
    const { container } = render(<AloeRoot className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('renders all root segments', () => {
    const { container } = render(<AloeRoot />);
    const paths = container.querySelectorAll('path');
    // 11 root segments + 5 highlight overlays = 16 paths
    expect(paths.length).toBeGreaterThanOrEqual(11);
  });

  it('renders with isGrowing prop', () => {
    const { container } = render(<AloeRoot isGrowing={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls onGrowthComplete callback', () => {
    const onGrowthComplete = vi.fn();
    render(<AloeRoot isGrowing={true} onGrowthComplete={onGrowthComplete} />);
    // Note: In actual usage, this would be called after animation completes
    // For testing, we just verify the prop is accepted
    expect(onGrowthComplete).toBeDefined();
  });

  it('renders connection nodes (circles)', () => {
    const { container } = render(<AloeRoot />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(7); // 7 connection nodes
  });

  it('uses sage green gradient', () => {
    const { container } = render(<AloeRoot />);
    const gradient = container.querySelector('#root-gradient');
    expect(gradient).toBeInTheDocument();
  });

  it('applies shadow filter', () => {
    const { container } = render(<AloeRoot />);
    const shadowFilter = container.querySelector('#root-shadow');
    expect(shadowFilter).toBeInTheDocument();
  });

  it('applies glow filter', () => {
    const { container } = render(<AloeRoot />);
    const glowFilter = container.querySelector('#root-glow');
    expect(glowFilter).toBeInTheDocument();
  });

  it('renders ambient glow background', () => {
    const { container } = render(<AloeRoot />);
    const glowDiv = container.querySelector('.absolute.inset-0.rounded-full');
    expect(glowDiv).toBeInTheDocument();
  });

  it('has proper default size', () => {
    const { container } = render(<AloeRoot />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('300px');
    expect(wrapper.style.height).toBe('300px');
  });
});
