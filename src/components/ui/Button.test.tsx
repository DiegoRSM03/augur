import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-augur-blue');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('border-augur-blue');
  });

  it('renders with secondary variant by default', () => {
    render(<Button>Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-text-primary');
    expect(button).toHaveClass('border-border');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-text-secondary');
    expect(button).toHaveClass('border-transparent');
  });

  it('renders with danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-severity-critical-bg');
    expect(button).toHaveClass('text-severity-critical');
    expect(button).toHaveClass('border-severity-critical-border');
  });

  it('renders with default size', () => {
    render(<Button>Default Size</Button>);
    const button = screen.getByText('Default Size');
    expect(button).toHaveClass('px-3.5');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-2.5');
    expect(button).toHaveClass('py-1');
    expect(button).toHaveClass('text-xs');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has correct base styles', () => {
    render(<Button>Base</Button>);
    const button = screen.getByText('Base');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('font-semibold');
    expect(button).toHaveClass('cursor-pointer');
    expect(button).toHaveClass('transition-all');
    expect(button).toHaveClass('border');
  });

  it('passes through additional props', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
