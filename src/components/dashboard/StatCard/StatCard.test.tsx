import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

vi.mock('motion/react', () => ({
  useReducedMotion: () => true,
}));

describe('StatCard', () => {
  it('renders label and numeric value', () => {
    render(<StatCard label="Total Indicators" value={1234} />);

    expect(screen.getByText('Total Indicators')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders label and string value', () => {
    render(<StatCard label="Status" value="Active" />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatCard label="Total" value={100} subtitle="Some info" />);

    expect(screen.getByText('Some info')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <StatCard
        label="Total"
        value={100}
        icon={<span data-testid="test-icon">icon</span>}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies severity variant color to value', () => {
    const { container } = render(
      <StatCard label="Critical" value={25} variant="critical" />
    );

    const valueEl = container.querySelector('.text-severity-critical');
    expect(valueEl).toBeInTheDocument();
  });

  it('applies total variant color to value', () => {
    const { container } = render(
      <StatCard label="Total" value={100} variant="total" />
    );

    const valueEl = container.querySelector('.text-text-primary');
    expect(valueEl).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<StatCard label="Total" value={100} />);

    const subtitleEl = screen.queryByText('Some info');
    expect(subtitleEl).not.toBeInTheDocument();
  });

  it('formats large numbers with locale separators', () => {
    render(<StatCard label="Total" value={10000} />);

    expect(screen.getByText('10,000')).toBeInTheDocument();
  });
});
