import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableHeader } from './TableHeader';

describe('TableHeader', () => {
  const defaultProps = {
    sortConfig: { column: null, direction: 'asc' as const },
    onSort: vi.fn(),
    showCheckbox: true,
    allSelected: false,
    someSelected: false,
    onSelectAll: vi.fn(),
  };

  it('renders all column headers', () => {
    render(
      <table>
        <TableHeader {...defaultProps} />
      </table>
    );

    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Confidence')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Last Seen')).toBeInTheDocument();
  });

  it('checkbox has accessible label', () => {
    render(
      <table>
        <TableHeader {...defaultProps} />
      </table>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleName('Select all indicators');
  });

  it('column headers have scope attribute', () => {
    render(
      <table>
        <TableHeader {...defaultProps} />
      </table>
    );

    const headers = screen.getAllByRole('columnheader');
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
  });

  it('calls onSelectAll when checkbox is clicked', () => {
    const onSelectAll = vi.fn();

    render(
      <table>
        <TableHeader {...defaultProps} onSelectAll={onSelectAll} />
      </table>
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('shows indeterminate state when someSelected but not allSelected', () => {
    render(
      <table>
        <TableHeader {...defaultProps} someSelected={true} allSelected={false} />
      </table>
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('calls onSort when sortable column header is clicked', () => {
    const onSort = vi.fn();

    render(
      <table>
        <TableHeader {...defaultProps} onSort={onSort} />
      </table>
    );

    fireEvent.click(screen.getByText('Indicator'));
    expect(onSort).toHaveBeenCalledWith('indicator');
  });

  it('hides checkbox when showCheckbox is false', () => {
    render(
      <table>
        <TableHeader {...defaultProps} showCheckbox={false} />
      </table>
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
