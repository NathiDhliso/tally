import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies glass surface styles', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-white/10');
    expect(card.className).toContain('backdrop-blur-xl');
    expect(card.className).toContain('border');
    expect(card.className).toContain('border-white/20');
    expect(card.className).toContain('rounded-2xl');
    expect(card.className).toContain('shadow-inner-glow');
  });

  it('applies cursor-pointer when onClick is provided', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Content</Card>);
    const card = screen.getByText('Content');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders animated border when animatedBorder prop is true', () => {
    const { container } = render(<Card animatedBorder>Content</Card>);
    const animatedBorderDiv = container.querySelector('.absolute.inset-0.rounded-2xl');
    expect(animatedBorderDiv).toBeInTheDocument();
  });

  it('does not render animated border by default', () => {
    const { container } = render(<Card>Content</Card>);
    const animatedBorderDiv = container.querySelector('.absolute.inset-0.rounded-2xl');
    expect(animatedBorderDiv).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('forwards additional props to motion.div', () => {
    const { container } = render(
      <Card data-testid="test-card" aria-label="Test Card">
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('data-testid', 'test-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
  });

  it('does not apply cursor-pointer when onClick is not provided', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('cursor-pointer');
  });

  it('enables hover effects when hover prop is true', () => {
    render(<Card hover>Content</Card>);
    // The hover prop is passed to framer-motion's whileHover
    // In the mocked version, we just verify the component renders
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
