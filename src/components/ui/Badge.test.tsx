import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with critical severity', () => {
    render(<Badge severity="critical" />);
    const badge = screen.getByText('critical');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-severity-critical');
    expect(badge).toHaveClass('bg-severity-critical-bg');
    expect(badge).toHaveClass('border-severity-critical-border');
  });

  it('renders with high severity', () => {
    render(<Badge severity="high" />);
    const badge = screen.getByText('high');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-severity-high');
    expect(badge).toHaveClass('bg-severity-high-bg');
  });

  it('renders with medium severity', () => {
    render(<Badge severity="medium" />);
    const badge = screen.getByText('medium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-severity-medium');
    expect(badge).toHaveClass('bg-severity-medium-bg');
  });

  it('renders with low severity', () => {
    render(<Badge severity="low" />);
    const badge = screen.getByText('low');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-severity-low');
    expect(badge).toHaveClass('bg-severity-low-bg');
  });

  it('applies custom className', () => {
    render(<Badge severity="critical" className="custom-class" />);
    const badge = screen.getByText('critical');
    expect(badge).toHaveClass('custom-class');
  });

  it('capitalizes the severity text', () => {
    render(<Badge severity="critical" />);
    const badge = screen.getByText('critical');
    expect(badge).toHaveClass('capitalize');
  });

  it('has correct base styles', () => {
    render(<Badge severity="high" />);
    const badge = screen.getByText('high');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-sm');
    expect(badge).toHaveClass('font-semibold');
    expect(badge).toHaveClass('border');
  });
});
