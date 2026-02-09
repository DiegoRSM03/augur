import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders children correctly', () => {
    render(<Tag>test-tag</Tag>);
    expect(screen.getByText('test-tag')).toBeInTheDocument();
  });

  it.each([
    { color: 'red' as const, text: 'malware' },
    { color: 'blue' as const, text: 'scanner' },
    { color: 'purple' as const, text: 'c2' },
    { color: 'teal' as const, text: 'phishing' },
  ])('renders with $color color', ({ color, text }) => {
    render(<Tag color={color}>{text}</Tag>);
    const tag = screen.getByText(text);
    expect(tag).toHaveClass(`bg-tag-${color}`);
    expect(tag).toHaveClass(`text-tag-${color}-text`);
    expect(tag).toHaveClass(`border-tag-${color}-border`);
  });

  it('renders with gray color by default', () => {
    render(<Tag>unknown</Tag>);
    const tag = screen.getByText('unknown');
    expect(tag).toHaveClass('bg-tag-gray');
    expect(tag).toHaveClass('text-tag-gray-text');
    expect(tag).toHaveClass('border-tag-gray-border');
  });

  it('applies custom className', () => {
    render(<Tag className="custom-class">test</Tag>);
    const tag = screen.getByText('test');
    expect(tag).toHaveClass('custom-class');
  });

  it('has correct base styles', () => {
    render(<Tag>test</Tag>);
    const tag = screen.getByText('test');
    expect(tag).toHaveClass('inline-flex');
    expect(tag).toHaveClass('items-center');
    expect(tag).toHaveClass('gap-1');
    expect(tag).toHaveClass('rounded-sm');
    expect(tag).toHaveClass('font-medium');
    expect(tag).toHaveClass('border');
  });

  it('renders complex children', () => {
    render(
      <Tag color="red">
        <span data-testid="icon">🔥</span>
        <span>hot-tag</span>
      </Tag>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('hot-tag')).toBeInTheDocument();
  });
});
