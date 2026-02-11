import { useState, useEffect, useCallback } from 'react';
import { fetchIndicators } from '../../api';
import type { Indicator, IndicatorFilters, PaginatedResponse } from '../../types/indicator';

interface UseIndicatorsReturn {
  data: Indicator[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching paginated indicators with filters
 *
 * @param filters - Optional filters for the query
 */
export function useIndicators(filters: IndicatorFilters = {}): UseIndicatorsReturn {
  const [response, setResponse] = useState<PaginatedResponse<Indicator> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Serialize filters to use as dependency
  const filterKey = JSON.stringify(filters);

  const loadIndicators = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchIndicators(filters);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch indicators'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    loadIndicators();
  }, [loadIndicators]);

  return {
    data: response?.data ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,
    loading,
    error,
    refetch: loadIndicators,
  };
}
