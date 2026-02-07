import { useState, useCallback, useMemo } from 'react';
import type { Indicator } from '../types/indicator';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface UseLocalIndicatorsReturn {
  /** Locally added indicators (in-memory) */
  localIndicators: Indicator[];
  /** Add a new indicator to local storage */
  addIndicator: (indicator: Omit<Indicator, 'id'>) => Indicator;
  /** Remove an indicator from local storage */
  removeIndicator: (id: string) => void;
  /** Clear all local indicators */
  clearIndicators: () => void;
  /** Get all indicator values (for duplicate detection) */
  localValues: string[];
}

/**
 * Hook for managing locally-added indicators in memory.
 *
 * Since there's no POST endpoint in the mock API, this hook stores
 * new indicators in React state. They persist for the session but
 * are lost on page refresh.
 *
 * Usage:
 * - Call addIndicator() with indicator data (without id)
 * - Merge localIndicators with API data for display
 * - New indicators appear at the top of the list
 */
export function useLocalIndicators(): UseLocalIndicatorsReturn {
  const [localIndicators, setLocalIndicators] = useState<Indicator[]>([]);

  /**
   * Add a new indicator with a generated UUID.
   * Returns the complete indicator with id.
   */
  const addIndicator = useCallback((indicatorData: Omit<Indicator, 'id'>): Indicator => {
    const newIndicator: Indicator = {
      ...indicatorData,
      id: generateUUID(),
    };

    // Add to the beginning of the array (most recent first)
    setLocalIndicators((prev) => [newIndicator, ...prev]);

    return newIndicator;
  }, []);

  /**
   * Remove an indicator by id
   */
  const removeIndicator = useCallback((id: string) => {
    setLocalIndicators((prev) => prev.filter((indicator) => indicator.id !== id));
  }, []);

  /**
   * Clear all local indicators
   */
  const clearIndicators = useCallback(() => {
    setLocalIndicators([]);
  }, []);

  /**
   * Get all local indicator values for duplicate detection
   */
  const localValues = useMemo(
    () => localIndicators.map((indicator) => indicator.value),
    [localIndicators]
  );

  return {
    localIndicators,
    addIndicator,
    removeIndicator,
    clearIndicators,
    localValues,
  };
}
