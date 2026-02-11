import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '../useDebounce';
import type { IndicatorType, Severity } from '../../types/indicator';

interface FiltersState {
  search: string;
  severity: Severity | '';
  type: IndicatorType | '';
  source: string;
}

interface ApiFilters {
  search: string | undefined;
  severity: Severity | undefined;
  type: IndicatorType | undefined;
  page: number;
  limit: number;
}

interface UseFiltersReturn {
  filters: FiltersState;
  page: number;
  apiFilters: ApiFilters;
  debouncedSearch: string;
  setSearch: (value: string) => void;
  setSeverity: (value: Severity | '') => void;
  setType: (value: IndicatorType | '') => void;
  setSource: (value: string) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
}

const DEFAULT_FILTERS: FiltersState = {
  search: '',
  severity: '',
  type: '',
  source: '',
};

interface UseFiltersOptions {
  pageLimit?: number;
  debounceMs?: number;
}

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { pageLimit = 20, debounceMs = 300 } = options;

  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [page, setPageState] = useState(1);

  const debouncedSearch = useDebounce(filters.search, debounceMs);

  const apiFilters = useMemo<ApiFilters>(
    () => ({
      search: debouncedSearch || undefined,
      severity: filters.severity || undefined,
      type: filters.type || undefined,
      page,
      limit: pageLimit,
    }),
    [debouncedSearch, filters.severity, filters.type, page, pageLimit]
  );

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPageState(1);
  }, []);

  const setSeverity = useCallback((value: Severity | '') => {
    setFilters((prev) => ({ ...prev, severity: value }));
    setPageState(1);
  }, []);

  const setType = useCallback((value: IndicatorType | '') => {
    setFilters((prev) => ({ ...prev, type: value }));
    setPageState(1);
  }, []);

  const setSource = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, source: value }));
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  return {
    filters,
    page,
    apiFilters,
    debouncedSearch,
    setSearch,
    setSeverity,
    setType,
    setSource,
    clearFilters,
    setPage,
  };
}
