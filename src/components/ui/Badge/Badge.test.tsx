import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it.each([
    { severity: 'critical' as const, classes: ['text-severity-critical', 'bg-severity-critical-bg', 'border-severity-critical-border'] },
    { severity: 'high' as const, classes: ['text-severity-high', 'bg-severity-high-bg'] },
    { severity: 'medium' as const, classes: ['text-severity-medium', 'bg-severity-medium-bg'] },
    { severity: 'low' as const, classes: ['text-severity-low', 'bg-severity-low-bg'] },
  ])('renders with $severity severity', ({ severity, classes }) => {
    render(<Badge severity={severity} />);
    const badge = screen.getByText(severity);
    expect(badge).toBeInTheDocument();
    classes.forEach((cls) => expect(badge).toHaveClass(cls));
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
