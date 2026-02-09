import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

// Mock motion/react
vi.mock('motion/react', () => ({
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
});
