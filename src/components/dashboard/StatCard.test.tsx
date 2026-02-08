import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, transition, style, ...props }: Record<string, unknown>) => (
      <div style={style as React.CSSProperties} {...props}>{children as React.ReactNode}</div>
    ),
  },
  useReducedMotion: () => true, // Disable animations in tests for immediate values
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

  it('shows progress bar when total is provided and variant is a severity', () => {
    render(
      <StatCard label="Critical" value={25} variant="critical" total={100} />
    );

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('does not show progress bar when total is undefined', () => {
    render(<StatCard label="Critical" value={25} variant="critical" />);

    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('does not show progress bar when variant is total', () => {
    render(<StatCard label="Total" value={100} variant="total" total={100} />);

    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('does not show progress bar when total is 0', () => {
    render(
      <StatCard label="Critical" value={0} variant="critical" total={0} />
    );

    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });
});
