import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders children correctly', () => {
    render(<Tag>test-tag</Tag>);
    expect(screen.getByText('test-tag')).toBeInTheDocument();
  });

  it('renders with red color', () => {
    render(<Tag color="red">malware</Tag>);
    const tag = screen.getByText('malware');
    expect(tag).toHaveClass('bg-tag-red');
    expect(tag).toHaveClass('text-tag-red-text');
    expect(tag).toHaveClass('border-tag-red-border');
  });

  it('renders with blue color', () => {
    render(<Tag color="blue">scanner</Tag>);
    const tag = screen.getByText('scanner');
    expect(tag).toHaveClass('bg-tag-blue');
    expect(tag).toHaveClass('text-tag-blue-text');
    expect(tag).toHaveClass('border-tag-blue-border');
  });

  it('renders with purple color', () => {
    render(<Tag color="purple">c2</Tag>);
    const tag = screen.getByText('c2');
    expect(tag).toHaveClass('bg-tag-purple');
    expect(tag).toHaveClass('text-tag-purple-text');
    expect(tag).toHaveClass('border-tag-purple-border');
  });

  it('renders with teal color', () => {
    render(<Tag color="teal">phishing</Tag>);
    const tag = screen.getByText('phishing');
    expect(tag).toHaveClass('bg-tag-teal');
    expect(tag).toHaveClass('text-tag-teal-text');
    expect(tag).toHaveClass('border-tag-teal-border');
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
