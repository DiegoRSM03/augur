import { useState, useCallback, useMemo } from 'react';
import type { Indicator } from '../types/indicator';

/**
 * Selection state management hook
 * 
 * Manages multi-select state that persists across pagination.
 * Stores full indicator objects so they're available for export even when
 * navigating to different pages.
 */
export function useSelection() {
  // Store full indicator objects in a Map for O(1) lookup
  const [selectedIndicators, setSelectedIndicators] = useState<Map<string, Indicator>>(new Map());

  /**
   * Toggle selection for a single indicator
   */
  const toggleSelection = useCallback((indicator: Indicator) => {
    setSelectedIndicators((prev) => {
      const next = new Map(prev);
      if (next.has(indicator.id)) {
        next.delete(indicator.id);
      } else {
        next.set(indicator.id, indicator);
      }
      return next;
    });
  }, []);

  /**
   * Select all provided indicators (adds to existing selection)
   */
  const selectAll = useCallback((indicators: Indicator[]) => {
    setSelectedIndicators((prev) => {
      const next = new Map(prev);
      indicators.forEach((indicator) => next.set(indicator.id, indicator));
      return next;
    });
  }, []);

  /**
   * Deselect all provided IDs (removes from existing selection)
   */
  const deselectAll = useCallback((ids: string[]) => {
    setSelectedIndicators((prev) => {
      const next = new Map(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedIndicators(new Map());
  }, []);

  /**
   * Check if an ID is selected
   */
  const isSelected = useCallback(
    (id: string) => selectedIndicators.has(id),
    [selectedIndicators]
  );

  /**
   * Get the Set of selected IDs (for compatibility)
   */
  const selectedIds = useMemo(() => {
    return new Set(selectedIndicators.keys());
  }, [selectedIndicators]);

  /**
   * Get derived state for current page
   */
  const getPageSelectionState = useCallback(
    (currentPageIds: string[]) => {
      const selectedOnPage = currentPageIds.filter((id) => selectedIndicators.has(id));
      const allSelected =
        currentPageIds.length > 0 &&
        selectedOnPage.length === currentPageIds.length;
      const someSelected =
        selectedOnPage.length > 0 && selectedOnPage.length < currentPageIds.length;

      return {
        allSelected,
        someSelected,
        selectedOnPageCount: selectedOnPage.length,
      };
    },
    [selectedIndicators]
  );

  /**
   * Toggle all on current page
   */
  const toggleAllOnPage = useCallback(
    (currentPageIndicators: Indicator[]) => {
      const currentPageIds = currentPageIndicators.map((i) => i.id);
      const { allSelected } = getPageSelectionState(currentPageIds);
      if (allSelected) {
        deselectAll(currentPageIds);
      } else {
        selectAll(currentPageIndicators);
      }
    },
    [getPageSelectionState, selectAll, deselectAll]
  );

  // Derived values
  const selectedCount = useMemo(() => selectedIndicators.size, [selectedIndicators]);
  const selectedArray = useMemo(() => Array.from(selectedIndicators.values()), [selectedIndicators]);

  return {
    selectedIds,
    selectedIndicators,
    selectedCount,
    selectedArray,
    toggleSelection,
    selectAll,
    deselectAll,
    clearSelection,
    isSelected,
    getPageSelectionState,
    toggleAllOnPage,
  };
}

export type UseSelectionReturn = ReturnType<typeof useSelection>;
