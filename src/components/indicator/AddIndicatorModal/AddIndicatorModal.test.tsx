import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddIndicatorModal } from './AddIndicatorModal';

describe('AddIndicatorModal', () => {
  const defaultProps = {
    isOpen: true,
    existingValues: ['192.168.1.1', 'example.com'],
    onClose: vi.fn(),
    onAdd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<AddIndicatorModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add Indicator' })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<AddIndicatorModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AddIndicatorModal {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside modal', () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const overlay = screen.getByRole('dialog').parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<AddIndicatorModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('auto-detects IP address type and shows detection hint', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(input, { target: { value: '10.0.0.1' } });

    // The type dropdown should be auto-selected
    await waitFor(() => {
      const typeSelect = screen.getAllByRole('combobox')[0]!;
      expect(typeSelect).toHaveValue('ip');
    });
  });

  it('auto-detects hash type', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    // SHA-256 hash
    fireEvent.change(input, { target: { value: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1' } });

    await waitFor(() => {
      const typeSelect = screen.getAllByRole('combobox')[0]!;
      expect(typeSelect).toHaveValue('hash');
    });
  });

  it('shows duplicate warning for existing values', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(input, { target: { value: '192.168.1.1' } });

    await waitFor(() => {
      expect(screen.getByText('An indicator with this value already exists')).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Add Indicator' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when all required fields are filled', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const valueInput = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(valueInput, { target: { value: '10.0.0.1' } });

    const selects = screen.getAllByRole('combobox');
    const severitySelect = selects[1]!; // Second select is severity
    fireEvent.change(severitySelect, { target: { value: 'critical' } });

    // Add a tag
    const tagInput = screen.getByPlaceholderText('Add tags (press Enter)...');
    fireEvent.change(tagInput, { target: { value: 'malware' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    // Submit button should now be enabled
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Add Indicator' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls onAdd with correct data when form is submitted', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const valueInput = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(valueInput, { target: { value: '10.0.0.1' } });

    const selects = screen.getAllByRole('combobox');
    const severitySelect = selects[1]!;
    fireEvent.change(severitySelect, { target: { value: 'high' } });

    const tagInput = screen.getByPlaceholderText('Add tags (press Enter)...');
    fireEvent.change(tagInput, { target: { value: 'botnet' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Add Indicator' });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', { name: 'Add Indicator' });
    fireEvent.click(submitButton);

    expect(defaultProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '10.0.0.1',
        type: 'ip',
        severity: 'high',
        tags: ['botnet'],
        source: 'Manual Entry',
      })
    );
  });

  it('keeps confidence independent from severity', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    expect(screen.getByText('50')).toBeInTheDocument();

    const selects = screen.getAllByRole('combobox');
    const severitySelect = selects[1]!;

    fireEvent.change(severitySelect, { target: { value: 'critical' } });

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('shows validation errors when submitting with empty fields', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    const valueInput = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(valueInput, { target: { value: '10.0.0.1' } });

    const selects = screen.getAllByRole('combobox');
    const severitySelect = selects[1]!;
    fireEvent.change(severitySelect, { target: { value: 'high' } });

    const submitButton = screen.getByRole('button', { name: 'Add Indicator' });
    expect(submitButton).toBeDisabled();
  });

  it('expands optional fields section when clicked', async () => {
    render(<AddIndicatorModal {...defaultProps} />);

    expect(screen.queryByText('First Seen')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Additional Fields (Optional)'));

    await waitFor(() => {
      expect(screen.getByText('First Seen')).toBeInTheDocument();
      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Related Campaigns')).toBeInTheDocument();
    });
  });

  it('resets form when modal reopens', async () => {
    const { rerender } = render(<AddIndicatorModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
    fireEvent.change(input, { target: { value: '10.0.0.1' } });

    rerender(<AddIndicatorModal {...defaultProps} isOpen={false} />);

    rerender(<AddIndicatorModal {...defaultProps} isOpen={true} />);

    await waitFor(() => {
      const newInput = screen.getByPlaceholderText('Enter IP, domain, hash, or URL...');
      expect(newInput).toHaveValue('');
    });
  });
});
