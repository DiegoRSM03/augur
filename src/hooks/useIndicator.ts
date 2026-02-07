import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchIndicatorById } from '../api/indicators';
import type { Indicator } from '../types/indicator';

interface UseIndicatorOptions {
  /** Local indicators to check before fetching from API */
  localIndicators?: Indicator[];
}

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
 * @param options - Optional configuration
 * @param options.localIndicators - Local indicators to check first (for newly added indicators)
 */
export function useIndicator(
  id: string | null,
  options: UseIndicatorOptions = {}
): UseIndicatorReturn {
  const { localIndicators = [] } = options;

  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if the indicator exists in local storage
  const localIndicator = useMemo(() => {
    if (!id) return null;
    return localIndicators.find((ind) => ind.id === id) || null;
  }, [id, localIndicators]);

  const loadIndicator = useCallback(async () => {
    if (!id) {
      setIndicator(null);
      setLoading(false);
      setError(null);
      return;
    }

    // If found in local indicators, use that directly (no API call needed)
    if (localIndicator) {
      setIndicator(localIndicator);
      setLoading(false);
      setError(null);
      return;
    }

    // Otherwise, fetch from API
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
  }, [id, localIndicator]);

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
