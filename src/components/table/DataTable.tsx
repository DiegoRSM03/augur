import type { Indicator } from '../../types/indicator';
import { Skeleton, Button } from '../ui';
import { SearchMinusIcon } from '../ui/icons';
import { TableHeader, type SortConfig, type SortColumn } from './TableHeader';
import { TableRow } from './TableRow';

interface DataTableProps {
  data: Indicator[];
  loading: boolean;
  error: Error | null;
  selectedIds: Set<string>;
  activeRowId: string | null;
  sortConfig: SortConfig;
  page?: number;
  onSort: (column: SortColumn) => void;
  onSelectRow: (indicator: Indicator) => void;
  onRowClick: (id: string) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 7 }).map((_, i) => (
        <tr key={i} className="border-b border-border-subtle">
          <td className="px-4 py-3">
            <Skeleton className="w-4 h-4" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="w-32 h-4" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="w-16 h-4" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="w-16 h-5" />
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-15 h-1" />
              <Skeleton className="w-6 h-4" />
            </div>
          </td>
          <td className="px-4 py-3 hidden sm:table-cell">
            <Skeleton className="w-20 h-4" />
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <div className="flex gap-1">
              <Skeleton className="w-14 h-5" />
              <Skeleton className="w-14 h-5" />
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="w-16 h-4" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function TableEmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <tbody>
      <tr>
        <td colSpan={8}>
          <div className="flex flex-col items-center justify-center py-16 text-text-tertiary text-center">
            <SearchMinusIcon className="w-12 h-12 opacity-30" />
            <p className="mt-4 text-sm font-medium">No indicators found</p>
            <p className="mt-1 text-xs">
              Try adjusting your search or filter criteria
            </p>
            {onClearFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function TableErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <tbody>
      <tr>
        <td colSpan={8}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-severity-critical mb-2">
              Failed to load indicators
            </p>
            <p className="text-text-tertiary text-sm mb-4">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-augur-blue hover:underline text-sm cursor-pointer"
              >
                Try again
              </button>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export function DataTable({
  data,
  loading,
  error,
  selectedIds,
  activeRowId,
  sortConfig,
  page = 1,
  onSort,
  onSelectRow,
  onRowClick,
  onSelectAll,
  allSelected = false,
  someSelected = false,
  onClearFilters,
  onRetry,
}: DataTableProps) {
  const renderBody = () => {
    if (loading) {
      return <TableSkeleton />;
    }

    if (error) {
      return <TableErrorState message={error.message} onRetry={onRetry} />;
    }

    if (data.length === 0) {
      return <TableEmptyState onClearFilters={onClearFilters} />;
    }

    // Key tbody by page + first item to re-trigger row entrance animations
    const tbodyKey = `${page}-${data[0]?.id ?? ''}`;

    return (
      <tbody key={tbodyKey}>
        {data.map((indicator, index) => (
          <TableRow
            key={indicator.id}
            indicator={indicator}
            isSelected={selectedIds.has(indicator.id)}
            isActive={activeRowId === indicator.id}
            index={index}
            onSelect={onSelectRow}
            onClick={onRowClick}
          />
        ))}
      </tbody>
    );
  };

  return (
    <div className="px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-5 md:px-8 md:pt-4 md:pb-6 flex-1">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border-subtle rounded-lg overflow-hidden">
          <TableHeader
            sortConfig={sortConfig}
            onSort={onSort}
            showCheckbox={true}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={onSelectAll}
          />
          {renderBody()}
        </table>
      </div>
    </div>
  );
}
