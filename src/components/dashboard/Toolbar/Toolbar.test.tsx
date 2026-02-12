import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Toolbar', () => {
  const defaultFilters = {
    search: '',
    severity: '' as const,
    type: '' as const,
    source: '',
  };

  const defaultProps = {
    filters: defaultFilters,
    onSearchChange: vi.fn(),
    onSeverityChange: vi.fn(),
    onTypeChange: vi.fn(),
    onSourceChange: vi.fn(),
    onClearFilters: vi.fn(),
    sources: ['AbuseIPDB', 'VirusTotal', 'OTX AlienVault'] as const,
    selectedCount: 0,
  };

  it('renders search input', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search indicators...')).toBeInTheDocument();
  });

  it('select dropdowns have accessible labels', () => {
    render(<Toolbar {...defaultProps} />);

    expect(screen.getAllByLabelText('Filter by severity').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Filter by indicator type').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Filter by source').length).toBeGreaterThan(0);
  });

  it('filter toggle button has accessible attributes', () => {
    render(<Toolbar {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: /toggle filters/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('filter toggle button shows expanded state when clicked', () => {
    render(<Toolbar {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: /toggle filters/i });
    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows active filter count badge when filters are applied', () => {
    const filtersWithValues = {
      ...defaultFilters,
      severity: 'critical' as const,
      type: 'ip' as const,
    };

    render(<Toolbar {...defaultProps} filters={filtersWithValues} />);

    // Should show badge with count of 2 (severity + type)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows selection badge when items are selected', () => {
    render(<Toolbar {...defaultProps} selectedCount={5} />);
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = vi.fn();

    render(<Toolbar {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText('Search indicators...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(onSearchChange).toHaveBeenCalledWith('test');
  });

  it('calls onClearFilters when clear button is clicked', () => {
    const onClearFilters = vi.fn();

    const filtersWithValues = {
      ...defaultFilters,
      search: 'test',
    };

    render(<Toolbar {...defaultProps} filters={filtersWithValues} onClearFilters={onClearFilters} />);

    // Click the visible clear filters button (on md+ screens)
    const clearButton = screen.getAllByRole('button', { name: /clear filters/i })[0];
    expect(clearButton).toBeDefined();
    fireEvent.click(clearButton!);

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
