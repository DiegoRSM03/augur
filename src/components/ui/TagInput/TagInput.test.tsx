import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  it('renders with placeholder when no tags', () => {
    render(<TagInput tags={[]} onChange={() => {}} placeholder="Add tag..." />);
    expect(screen.getByPlaceholderText('Add tag...')).toBeInTheDocument();
  });

  it('renders existing tags as chips', () => {
    render(<TagInput tags={['malware', 'botnet']} onChange={() => {}} />);
    expect(screen.getByText('malware')).toBeInTheDocument();
    expect(screen.getByText('botnet')).toBeInTheDocument();
  });

  it('adds a tag when Enter is pressed', () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newtag' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('adds a tag when comma is pressed', () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newtag' } });
    fireEvent.keyDown(input, { key: ',' });

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('removes a tag when X button is clicked', () => {
    const onChange = vi.fn();
    render(<TagInput tags={['malware', 'botnet']} onChange={onChange} />);

    const removeButton = screen.getByLabelText('Remove malware tag');
    fireEvent.click(removeButton);

    expect(onChange).toHaveBeenCalledWith(['botnet']);
  });

  it('prevents duplicate tags', () => {
    const onChange = vi.fn();
    render(<TagInput tags={['existing']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'existing' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('trims whitespace and lowercases tags', () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  UPPERCASE  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['uppercase']);
  });

  it('removes last tag on backspace when input is empty', () => {
    const onChange = vi.fn();
    render(<TagInput tags={['first', 'second']} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(onChange).toHaveBeenCalledWith(['first']);
  });

  it('does not add empty tags', () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows error state when error prop is true', () => {
    const { container } = render(<TagInput tags={[]} onChange={() => {}} error />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('border-severity-critical');
  });

  it('adds tag on blur if input has value', () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'blurtag' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(['blurtag']);
  });
});
