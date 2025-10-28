import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Toast from '../Toast';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    svg: ({ children, className, ...props }: any) => (
      <svg className={className} {...props}>
        {children}
      </svg>
    ),
    path: ({ ...props }: any) => <path {...props} />,
    circle: ({ ...props }: any) => <circle {...props} />,
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

// Mock useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders success toast with message', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" type="success" message="Success message" onClose={onClose} />
    );

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error toast with message', () => {
    const onClose = vi.fn();
    render(<Toast id="test-2" type="error" message="Error message" onClose={onClose} />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders warning toast with message', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-3" type="warning" message="Warning message" onClose={onClose} />
    );

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('renders info toast with message', () => {
    const onClose = vi.fn();
    render(<Toast id="test-4" type="info" message="Info message" onClose={onClose} />);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-5" type="success" message="Test message" onClose={onClose} />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledWith('test-5');
  });

  it('auto-closes after duration', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-6"
        type="success"
        message="Test message"
        duration={3000}
        onClose={onClose}
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    // Advance timers to trigger the auto-close
    vi.advanceTimersByTime(3000);

    expect(onClose).toHaveBeenCalledWith('test-6');
  });

  it('applies correct colors for success type', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Toast id="test-7" type="success" message="Success" onClose={onClose} />
    );

    const toastElement = container.querySelector('[role="alert"]');
    expect(toastElement?.className).toContain('bg-sage-500/10');
    expect(toastElement?.className).toContain('border-sage-500/30');
  });

  it('applies correct colors for error type', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Toast id="test-8" type="error" message="Error" onClose={onClose} />
    );

    const toastElement = container.querySelector('[role="alert"]');
    expect(toastElement?.className).toContain('bg-red-500/10');
    expect(toastElement?.className).toContain('border-red-500/30');
  });

  it('has glassmorphic appearance', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Toast id="test-9" type="info" message="Info" onClose={onClose} />
    );

    const toastElement = container.querySelector('[role="alert"]');
    expect(toastElement?.className).toContain('backdrop-blur-xl');
    expect(toastElement?.className).toContain('rounded-xl');
  });
});
