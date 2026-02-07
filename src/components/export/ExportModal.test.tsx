import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportModal } from './ExportModal';
import type { Indicator } from '../../types/indicator';

describe('ExportModal', () => {
  const createMockIndicator = (overrides: Partial<Indicator> = {}): Indicator => ({
    id: 'test-id-1',
    value: '192.168.1.1',
    type: 'ip',
    severity: 'high',
    source: 'TestSource',
    confidence: 85,
    firstSeen: '2025-01-01T00:00:00.000Z',
    lastSeen: '2025-01-15T12:00:00.000Z',
    tags: ['malware', 'botnet'],
    ...overrides,
  });

  const mockIndicators = [
    createMockIndicator({ id: 'id-1', value: '1.1.1.1', severity: 'critical' }),
    createMockIndicator({ id: 'id-2', value: '2.2.2.2', severity: 'high' }),
    createMockIndicator({ id: 'id-3', value: 'malware.com', type: 'domain', severity: 'medium' }),
  ];

  it('renders modal with title and subtitle', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('Export Indicators')).toBeInTheDocument();
    expect(screen.getByText('Review your selection before exporting')).toBeInTheDocument();
  });

  it('displays all indicators with checkboxes', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('1.1.1.1')).toBeInTheDocument();
    expect(screen.getByText('2.2.2.2')).toBeInTheDocument();
    expect(screen.getByText('malware.com')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('all checkboxes are checked by default', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it('shows correct count in footer', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/indicators/)).toBeInTheDocument();
  });

  it('updates count when checkbox is unchecked', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]!);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={onClose}
        onExport={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button (X) is clicked', () => {
    const onClose = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={onClose}
        onExport={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Close modal'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onExport with all selected IDs when Export CSV is clicked', () => {
    const onExport = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={onExport}
      />
    );

    fireEvent.click(screen.getByText('Export CSV'));

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledWith(['id-1', 'id-2', 'id-3']);
  });

  it('calls onExport with only checked IDs after unchecking some', () => {
    const onExport = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={onExport}
      />
    );

    // Uncheck first and third items
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]!);
    fireEvent.click(checkboxes[2]!);

    fireEvent.click(screen.getByText('Export CSV'));

    expect(onExport).toHaveBeenCalledWith(['id-2']);
  });

  it('disables Export CSV button when no items selected', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    // Uncheck all items
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    const exportButton = screen.getByText('Export CSV');
    expect(exportButton).toBeDisabled();
  });

  it('displays severity badges for each indicator', () => {
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    // Badge component renders lowercase text with CSS capitalize
    expect(screen.getByText('critical')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('displays source for each indicator', () => {
    const indicators = [
      createMockIndicator({ id: 'id-1', source: 'SourceA' }),
      createMockIndicator({ id: 'id-2', source: 'SourceB' }),
    ];

    render(
      <ExportModal
        indicators={indicators}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('SourceA')).toBeInTheDocument();
    expect(screen.getByText('SourceB')).toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={onClose}
        onExport={vi.fn()}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking overlay background', () => {
    const onClose = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={onClose}
        onExport={vi.fn()}
      />
    );

    // Click on the overlay (the outermost div)
    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal', () => {
    const onClose = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={onClose}
        onExport={vi.fn()}
      />
    );

    // Click on the modal content
    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('handles single indicator correctly', () => {
    const singleIndicator = [createMockIndicator({ id: 'single-id' })];

    render(
      <ExportModal
        indicators={singleIndicator}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/indicator$/)).toBeInTheDocument(); // singular
  });

  it('can toggle items on and off', () => {
    const onExport = vi.fn();
    render(
      <ExportModal
        indicators={mockIndicators}
        onClose={vi.fn()}
        onExport={onExport}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');

    // Uncheck first item
    fireEvent.click(checkboxes[0]!);
    expect(checkboxes[0]).not.toBeChecked();

    // Re-check first item
    fireEvent.click(checkboxes[0]!);
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(screen.getByText('Export CSV'));
    // All items should be exported (order may vary due to Set iteration)
    expect(onExport).toHaveBeenCalledTimes(1);
    const exportedIds = onExport.mock.calls[0]![0];
    expect(exportedIds).toHaveLength(3);
    expect(exportedIds).toContain('id-1');
    expect(exportedIds).toContain('id-2');
    expect(exportedIds).toContain('id-3');
  });
});
