import { useCallback, useRef } from 'react';
import { useToast } from '../useToast';
import { exportIndicatorsToCsv } from '../../utils/exportCsv';
import type { Indicator } from '../../types/indicator';

interface UseDashboardActionsOptions {
  selectedArray: Indicator[];
  selectedCount: number;
  clearSelection: () => void;
  clearFilters: () => void;
  addIndicator: (indicator: Omit<Indicator, 'id'>) => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  closeAddModal: () => void;
}

interface UseDashboardActionsReturn {
  tableWrapperRef: React.RefObject<HTMLDivElement>;
  toasts: ReturnType<typeof useToast>['toasts'];
  dismissToast: ReturnType<typeof useToast>['dismissToast'];
  handleExportClick: () => void;
  handleExport: (idsToExport: string[]) => void;
  handleAddIndicator: (indicatorData: Omit<Indicator, 'id'>) => void;
}

export function useDashboardActions(
  options: UseDashboardActionsOptions
): UseDashboardActionsReturn {
  const {
    selectedArray,
    selectedCount,
    clearSelection,
    clearFilters,
    addIndicator,
    openExportModal,
    closeExportModal,
    closeAddModal,
  } = options;

  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { toasts, showToast, dismissToast } = useToast();

  const handleExportClick = useCallback(() => {
    if (selectedCount === 0) {
      showToast('No indicators selected', 'info');
      return;
    }
    openExportModal();
  }, [selectedCount, showToast, openExportModal]);

  const handleExport = useCallback(
    (idsToExport: string[]) => {
      const indicatorsToExport = selectedArray.filter((indicator) =>
        idsToExport.includes(indicator.id)
      );

      if (indicatorsToExport.length === 0) {
        showToast('No indicators to export', 'error');
        return;
      }

      exportIndicatorsToCsv(indicatorsToExport);
      closeExportModal();
      showToast(
        `Successfully exported ${indicatorsToExport.length} indicator${indicatorsToExport.length !== 1 ? 's' : ''}`,
        'success'
      );
      clearSelection();
    },
    [selectedArray, showToast, clearSelection, closeExportModal]
  );

  const handleAddIndicator = useCallback(
    (indicatorData: Omit<Indicator, 'id'>) => {
      addIndicator(indicatorData);
      closeAddModal();
      showToast('Indicator added successfully', 'success');
      clearFilters();
      setTimeout(() => {
        tableWrapperRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    },
    [addIndicator, showToast, clearFilters, closeAddModal]
  );

  return {
    tableWrapperRef,
    toasts,
    dismissToast,
    handleExportClick,
    handleExport,
    handleAddIndicator,
  };
}
