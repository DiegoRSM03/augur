import { useState, useCallback } from 'react';
import type { SortConfig, SortColumn, SortDirection } from '../../components/table';

interface UseSortStateOptions {
  initialColumn?: SortColumn;
  initialDirection?: SortDirection;
}

interface UseSortStateReturn {
  sortConfig: SortConfig;
  handleSort: (column: SortColumn) => void;
}

export function useSortState(options: UseSortStateOptions = {}): UseSortStateReturn {
  const { initialColumn = 'lastSeen', initialDirection = 'desc' } = options;

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: initialColumn,
    direction: initialDirection,
  });

  const handleSort = useCallback((column: SortColumn) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return { sortConfig, handleSort };
}
