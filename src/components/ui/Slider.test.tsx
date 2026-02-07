import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders with current value displayed', () => {
    render(<Slider value={75} onChange={() => {}} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders preset buttons by default', () => {
    render(<Slider value={50} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Low' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'High' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Critical' })).toBeInTheDocument();
  });

  it('hides preset buttons when showPresets is false', () => {
    render(<Slider value={50} onChange={() => {}} showPresets={false} />);
    expect(screen.queryByRole('button', { name: 'Low' })).not.toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });

    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('calls onChange when preset button is clicked', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Critical' }));

    expect(onChange).toHaveBeenCalledWith(90);
  });

  it('applies correct color class for low values (0-39)', () => {
    render(<Slider value={25} onChange={() => {}} />);
    const valueDisplay = screen.getByText('25');
    expect(valueDisplay).toHaveClass('text-severity-low');
  });

  it('applies correct color class for medium values (40-59)', () => {
    render(<Slider value={50} onChange={() => {}} />);
    const valueDisplay = screen.getByText('50');
    expect(valueDisplay).toHaveClass('text-severity-medium');
  });

  it('applies correct color class for high values (60-79)', () => {
    render(<Slider value={70} onChange={() => {}} />);
    const valueDisplay = screen.getByText('70');
    expect(valueDisplay).toHaveClass('text-severity-high');
  });

  it('applies correct color class for critical values (80-100)', () => {
    render(<Slider value={90} onChange={() => {}} />);
    const valueDisplay = screen.getByText('90');
    expect(valueDisplay).toHaveClass('text-severity-critical');
  });

  it('respects custom min and max values', () => {
    render(<Slider value={5} onChange={() => {}} min={0} max={10} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
  });

  it('highlights active preset button', () => {
    render(<Slider value={75} onChange={() => {}} />);
    const highButton = screen.getByRole('button', { name: 'High' });
    expect(highButton).toHaveClass('bg-bg-card');
  });
});
