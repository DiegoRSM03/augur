import React from 'react';

export type SortColumn =
  | 'indicator'
  | 'type'
  | 'severity'
  | 'confidence'
  | 'source'
  | 'lastSeen';

export type SortDirection = 'asc' | 'desc';

interface SortConfig {
  column: SortColumn | null;
  direction: SortDirection;
}

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (column: SortColumn) => void;
  showCheckbox?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
}

interface ColumnDef {
  key: SortColumn | 'checkbox' | 'tags';
  label: string;
  sortable: boolean;
  width?: string;
  responsiveClass?: string;
}

const columns: ColumnDef[] = [
  { key: 'checkbox', label: '', sortable: false, width: '28px' },
  { key: 'indicator', label: 'Indicator', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'severity', label: 'Severity', sortable: true },
  { key: 'confidence', label: 'Confidence', sortable: true },
  { key: 'source', label: 'Source', sortable: true, responsiveClass: 'hidden sm:table-cell' },
  { key: 'tags', label: 'Tags', sortable: false, responsiveClass: 'hidden md:table-cell' },
  { key: 'lastSeen', label: 'Last Seen', sortable: true },
];

/**
 * Sort indicator icon
 */
function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <span className="ml-1 opacity-40">↕</span>;
  }
  return (
    <span className="ml-1 opacity-100">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

/**
 * Checkbox with indeterminate state support
 */
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange?: () => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-augur-blue cursor-pointer"
    />
  );
}

/**
 * Table header component with sortable columns
 */
export function TableHeader({
  sortConfig,
  onSort,
  showCheckbox = true,
  allSelected = false,
  someSelected = false,
  onSelectAll,
}: TableHeaderProps) {
  return (
    <thead className="bg-bg-elevated">
      <tr>
        {columns.map((column) => {
          if (column.key === 'checkbox') {
            if (!showCheckbox) return null;
            return (
              <th
                key={column.key}
                className="px-4 py-3 text-left border-b border-border"
                style={{ width: column.width }}
              >
                <IndeterminateCheckbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={onSelectAll}
                />
              </th>
            );
          }

          const isSortable = column.sortable;
          const isActive = sortConfig.column === column.key;

          return (
            <th
              key={column.key}
              className={`
                px-4 py-3
                text-[10.5px] font-semibold uppercase tracking-[0.8px]
                text-text-tertiary text-left
                border-b border-border
                whitespace-nowrap
                select-none
                ${isSortable ? 'cursor-pointer hover:text-text-secondary' : ''}
                ${column.responsiveClass ?? ''}
              `}
              style={{ width: column.width }}
              onClick={() => isSortable && onSort(column.key as SortColumn)}
            >
              {column.label}
              {isSortable && (
                <SortIcon active={isActive} direction={sortConfig.direction} />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export type { SortConfig };
