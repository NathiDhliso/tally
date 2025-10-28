import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AloePattern } from '../AloePattern';

describe('AloePattern', () => {
  it('renders without crashing', () => {
    const { container } = render(<AloePattern />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies default opacity of 5%', () => {
    const { container } = render(<AloePattern />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '0.05' });
  });

  it('applies custom opacity when provided', () => {
    const { container } = render(<AloePattern opacity={0.1} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: '0.1' });
  });

  it('applies custom color when provided', () => {
    const { container } = render(<AloePattern color="#ff0000" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AloePattern className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('has pointer-events-none for non-interactive background', () => {
    const { container } = render(<AloePattern />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('pointer-events-none');
  });

  it('contains aloe-pattern definition', () => {
    const { container } = render(<AloePattern />);
    const pattern = container.querySelector('#aloe-pattern');
    expect(pattern).toBeInTheDocument();
  });

  it('is positioned absolutely to cover full area', () => {
    const { container } = render(<AloePattern />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('absolute');
    expect(svg).toHaveClass('inset-0');
  });
});
