import { useState, useEffect, useCallback } from 'react';
import { fetchIndicatorById } from '../api/indicators';
import type { Indicator } from '../types/indicator';

interface UseIndicatorReturn {
  indicator: Indicator | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching a single indicator by ID
 *
 * @param id - The indicator ID to fetch, or null to skip fetching
 */
export function useIndicator(id: string | null): UseIndicatorReturn {
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadIndicator = useCallback(async () => {
    if (!id) {
      setIndicator(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchIndicatorById(id);
      setIndicator(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch indicator'));
      setIndicator(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadIndicator();
  }, [loadIndicator]);

  return {
    indicator,
    loading,
    error,
    refetch: loadIndicator,
  };
}
