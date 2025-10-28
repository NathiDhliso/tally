import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, disabled, ...props }: any) => (
      <button className={className} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
    svg: ({ children, className, viewBox, ...props }: any) => (
      <svg className={className} viewBox={viewBox} {...props}>
        {children}
      </svg>
    ),
  },
}));

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies glassmorphic styles for primary variant', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary').closest('button');
    expect(button?.className).toContain('bg-white/10');
    expect(button?.className).toContain('backdrop-blur-md');
    expect(button?.className).toContain('border-white/20');
  });

  it('applies glassmorphic styles for secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary').closest('button');
    expect(button?.className).toContain('bg-sage-500/10');
    expect(button?.className).toContain('backdrop-blur-md');
  });

  it('applies outline styles', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline').closest('button');
    expect(button?.className).toContain('border-sage-500/50');
    expect(button?.className).toContain('backdrop-blur-sm');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled').closest('button');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Check for SVG spinner
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders icon on left by default', () => {
    const icon = <span data-testid="icon">🔥</span>;
    render(<Button icon={icon}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders icon on right when iconPosition is right', () => {
    const icon = <span data-testid="icon">🔥</span>;
    render(
      <Button icon={icon} iconPosition="right">
        With Icon
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByText('Small').closest('button');
    expect(button?.className).toContain('px-3');
    expect(button?.className).toContain('py-1.5');

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByText('Medium').closest('button');
    expect(button?.className).toContain('px-4');
    expect(button?.className).toContain('py-2');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByText('Large').closest('button');
    expect(button?.className).toContain('px-6');
    expect(button?.className).toContain('py-3');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom').closest('button');
    expect(button?.className).toContain('custom-class');
  });

  it('includes group class for focus effects', () => {
    render(<Button>Focus Test</Button>);
    const button = screen.getByText('Focus Test').closest('button');
    expect(button?.className).toContain('group');
  });

  it('includes glow shadow on hover', () => {
    render(<Button variant="primary">Hover Test</Button>);
    const button = screen.getByText('Hover Test').closest('button');
    expect(button?.className).toContain('hover:shadow-glow-sage');
  });
});
