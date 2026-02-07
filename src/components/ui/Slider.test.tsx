import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders with current value displayed', () => {
    render(<Slider value={75} onChange={() => {}} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders preset stop markers by default', () => {
    render(<Slider value={50} onChange={() => {}} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('hides preset markers when showPresets is false', () => {
    render(<Slider value={50} onChange={() => {}} showPresets={false} />);
    expect(screen.queryByText('25%')).not.toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });

    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('calls onChange when preset marker is clicked', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} />);

    fireEvent.click(screen.getByText('100%'));

    expect(onChange).toHaveBeenCalledWith(100);
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

  it('highlights active preset marker', () => {
    render(<Slider value={75} onChange={() => {}} />);
    const label = screen.getByText('75%');
    expect(label).toHaveClass('text-text-primary');
  });
});
