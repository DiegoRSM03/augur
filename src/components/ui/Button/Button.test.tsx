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

  it.each([
    { variant: 'primary' as const, classes: ['bg-augur-blue', 'text-white', 'border-augur-blue'] },
    { variant: 'secondary' as const, classes: ['bg-transparent', 'text-text-primary', 'border-border'] },
    { variant: 'ghost' as const, classes: ['bg-transparent', 'text-text-secondary', 'border-transparent'] },
    { variant: 'danger' as const, classes: ['bg-severity-critical-bg', 'text-severity-critical', 'border-severity-critical-border'] },
  ])('renders with $variant variant', ({ variant, classes }) => {
    render(<Button variant={variant}>{variant}</Button>);
    const button = screen.getByText(variant);
    classes.forEach((cls) => expect(button).toHaveClass(cls));
  });

  it.each([
    { size: 'default' as const, label: 'Default Size', classes: ['px-3.5', 'py-1.5', 'text-sm'] },
    { size: 'sm' as const, label: 'Small', classes: ['px-2.5', 'py-1', 'text-xs'] },
  ])('renders with $size size', ({ size, label, classes }) => {
    render(<Button size={size}>{label}</Button>);
    const button = screen.getByText(label);
    classes.forEach((cls) => expect(button).toHaveClass(cls));
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
