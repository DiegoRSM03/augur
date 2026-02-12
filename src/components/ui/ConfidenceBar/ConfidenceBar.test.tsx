import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceBar } from './ConfidenceBar';

describe('ConfidenceBar', () => {
  it('renders with correct value', () => {
    render(<ConfidenceBar value={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders progressbar with correct aria attributes', () => {
    render(<ConfidenceBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('has accessible name for progress bar', () => {
    render(<ConfidenceBar value={75} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAccessibleName('Confidence: 75%');
  });

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<ConfidenceBar value={150} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<ConfidenceBar value={-20} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('hides value when showValue is false', () => {
    render(<ConfidenceBar value={75} showValue={false} />);
    expect(screen.queryByText('75')).not.toBeInTheDocument();
  });

  it('uses severity-based color when no severity prop', () => {
    const { rerender } = render(<ConfidenceBar value={85} />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-severity-critical');
    expect(screen.getByText('85')).toHaveClass('text-severity-critical');

    rerender(<ConfidenceBar value={70} />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-severity-high');
    expect(screen.getByText('70')).toHaveClass('text-severity-high');

    rerender(<ConfidenceBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-severity-medium');
    expect(screen.getByText('50')).toHaveClass('text-severity-medium');

    rerender(<ConfidenceBar value={30} />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-severity-low');
    expect(screen.getByText('30')).toHaveClass('text-severity-low');
  });

  it('uses explicit severity prop when provided', () => {
    render(<ConfidenceBar value={30} severity="critical" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-severity-critical');
    expect(screen.getByText('30')).toHaveClass('text-severity-critical');
  });

  it('applies custom className', () => {
    render(<ConfidenceBar value={50} className="custom-class" />);
    const container = screen.getByRole('progressbar').parentElement?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('sets correct width style based on value', () => {
    render(<ConfidenceBar value={65} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '65%' });
  });
});
