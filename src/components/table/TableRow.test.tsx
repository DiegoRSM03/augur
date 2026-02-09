import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableRow } from './TableRow';
import type { Indicator } from '../../types/indicator';

// Mock motion/react to render plain elements in tests
vi.mock('motion/react', () => ({
  motion: {
    tr: ({ children, initial: _initial, animate: _animate, transition: _transition, ...props }: Record<string, unknown>) => {
      const filteredProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !key.startsWith('on') || ['onClick', 'onChange'].includes(key))
      );
      return <tr {...filteredProps}>{children as React.ReactNode}</tr>;
    },
  },
  useReducedMotion: () => false,
}));

// Mock the formatters module
vi.mock('../../utils/formatters', () => ({
  formatRelativeTime: () => '2 min ago',
  getTagColor: (tag: string) => {
    if (tag.includes('malware') || tag.includes('tor')) return 'red';
    if (tag.includes('c2')) return 'purple';
    return 'gray';
  },
  getTypeIcon: (type: string) => {
    const icons: Record<string, string> = { ip: '⬡', domain: '◎', hash: '#', url: '🔗' };
    return icons[type] ?? '•';
  },
  getTypeLabel: (type: string) => {
    const labels: Record<string, string> = { ip: 'IP', domain: 'Domain', hash: 'Hash', url: 'URL' };
    return labels[type] ?? type.toUpperCase();
  },
}));

const mockIndicator: Indicator = {
  id: 'test-id-1',
  value: '192.168.1.1',
  type: 'ip',
  severity: 'critical',
  source: 'AbuseIPDB',
  firstSeen: '2026-01-01T00:00:00Z',
  lastSeen: '2026-02-07T12:00:00Z',
  tags: ['tor-exit', 'botnet'],
  confidence: 94,
};

// Helper to render TableRow inside a table
function renderTableRow(props: Partial<Parameters<typeof TableRow>[0]> = {}) {
  const defaultProps = {
    indicator: mockIndicator,
    isSelected: false,
    index: 0,
    onSelect: vi.fn(),
    onClick: vi.fn(),
  };

  return render(
    <table>
      <tbody>
        <TableRow {...defaultProps} {...props} />
      </tbody>
    </table>
  );
}

describe('TableRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders indicator value', () => {
    renderTableRow();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  });

  it('renders indicator type', () => {
    renderTableRow();
    // Text is split by whitespace, use getAllByText and check the span element
    const typeElements = screen.getAllByText((_content, element) => {
      return element?.tagName === 'SPAN' && element?.textContent === '⬡ IP';
    });
    expect(typeElements.length).toBeGreaterThan(0);
  });

  it('renders severity badge', () => {
    renderTableRow();
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('renders source', () => {
    renderTableRow();
    expect(screen.getByText('AbuseIPDB')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderTableRow();
    expect(screen.getByText('tor-exit')).toBeInTheDocument();
    expect(screen.getByText('botnet')).toBeInTheDocument();
  });

  it('renders last seen time', () => {
    renderTableRow();
    expect(screen.getByText('2 min ago')).toBeInTheDocument();
  });

  it('calls onClick when row is clicked', () => {
    const onClick = vi.fn();
    renderTableRow({ onClick });

    const row = screen.getByRole('row');
    fireEvent.click(row);

    expect(onClick).toHaveBeenCalledWith('test-id-1');
  });

  it('calls onSelect with full indicator when checkbox is clicked', () => {
    const onSelect = vi.fn();
    renderTableRow({ onSelect });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(mockIndicator);
  });

  it('does not trigger row click when checkbox is clicked', () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    renderTableRow({ onClick, onSelect });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(mockIndicator);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies selected styles when isSelected is true', () => {
    renderTableRow({ isSelected: true });

    const row = screen.getByRole('row');
    expect(row).toHaveClass('bg-augur-blue-dim');
  });

  it('applies hover styles when not selected', () => {
    renderTableRow({ isSelected: false });

    const row = screen.getByRole('row');
    expect(row).toHaveClass('hover:bg-bg-card-hover');
  });

  it('checkbox is checked when isSelected is true', () => {
    renderTableRow({ isSelected: true });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('checkbox is unchecked when isSelected is false', () => {
    renderTableRow({ isSelected: false });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('truncates tags when there are more than 3', () => {
    const indicatorWithManyTags: Indicator = {
      ...mockIndicator,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };

    renderTableRow({ indicator: indicatorWithManyTags });

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('tag4')).not.toBeInTheDocument();
    expect(screen.queryByText('tag5')).not.toBeInTheDocument();
  });

  it('uses smaller font for hash type values', () => {
    const hashIndicator: Indicator = {
      ...mockIndicator,
      type: 'hash',
      value: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    };

    renderTableRow({ indicator: hashIndicator });

    const valueCell = screen.getByText(hashIndicator.value);
    expect(valueCell).toHaveClass('text-[11px]!');
  });

  it('renders with different severity levels', () => {
    const severities = ['critical', 'high', 'medium', 'low'] as const;

    severities.forEach((severity) => {
      const { unmount } = renderTableRow({
        indicator: { ...mockIndicator, severity },
      });

      expect(screen.getByText(severity)).toBeInTheDocument();
      unmount();
    });
  });
});
