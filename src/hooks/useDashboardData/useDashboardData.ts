import { useMemo, useCallback } from 'react';
import { useIndicators } from '../useIndicators';
import { useLocalIndicators } from '../useLocalIndicators';
import { sortIndicators } from '../../utils/sortIndicators';
import type { SortConfig } from '../../components/table';
import type { Indicator, IndicatorType, Severity } from '../../types/indicator';

interface ApiFilters {
  search: string | undefined;
  severity: Severity | undefined;
  type: IndicatorType | undefined;
  page: number;
  limit: number;
}

interface UseDashboardDataOptions {
  apiFilters: ApiFilters;
  sourceFilter: string;
  sortConfig: SortConfig;
}

interface UseDashboardDataReturn {
  data: Indicator[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  localIndicators: Indicator[];
  addIndicator: (indicator: Omit<Indicator, 'id'>) => void;
  existingValues: string[];
}

export function useDashboardData(options: UseDashboardDataOptions): UseDashboardDataReturn {
  const { apiFilters, sourceFilter, sortConfig } = options;

  const {
    data: rawData,
    total,
    totalPages,
    loading,
    error,
    refetch,
  } = useIndicators(apiFilters);

  const { localIndicators, addIndicator, localValues } = useLocalIndicators();

  const mergedData = useMemo(
    () => [...localIndicators, ...rawData],
    [localIndicators, rawData]
  );

  const filteredData = useMemo(() => {
    if (!sourceFilter) return mergedData;
    return mergedData.filter((indicator) => indicator.source === sourceFilter);
  }, [mergedData, sourceFilter]);

  const sortedData = useMemo(
    () => sortIndicators(filteredData, sortConfig),
    [filteredData, sortConfig]
  );

  const existingValues = useMemo(() => {
    const apiValues = rawData.map((indicator) => indicator.value);
    return [...localValues, ...apiValues];
  }, [rawData, localValues]);

  const stableAddIndicator = useCallback(
    (indicatorData: Omit<Indicator, 'id'>) => {
      addIndicator(indicatorData);
    },
    [addIndicator]
  );

  return {
    data: sortedData,
    total,
    totalPages,
    loading,
    error,
    refetch,
    localIndicators,
    addIndicator: stableAddIndicator,
    existingValues,
  };
}
