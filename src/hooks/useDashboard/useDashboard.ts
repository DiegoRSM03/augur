import { useMemo, useCallback, useEffect } from 'react';
import { useFilters } from '../useFilters';
import { useDisclosure } from '../useDisclosure';
import { useSortState } from '../useSortState';
import { useDetailPanel } from '../useDetailPanel';
import { useDashboardData } from '../useDashboardData';
import { useDashboardActions } from '../useDashboardActions';
import { useSelection } from '../useSelection';
import { useIndicator } from '../useIndicator';
import { useLockBodyScroll } from '../useLockBodyScroll';
import { useBreakpoint } from '../useBreakpoint';
import type { Indicator } from '../../types/indicator';

interface UseDashboardOptions {
  pageLimit?: number;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { pageLimit = 20 } = options;

  // State hooks
  const {
    filters,
    page,
    apiFilters,
    setSearch,
    setSeverity,
    setType,
    setSource,
    clearFilters,
    setPage,
  } = useFilters({ pageLimit });

  const { sortConfig, handleSort } = useSortState();
  const exportModal = useDisclosure();
  const addModal = useDisclosure();
  const sidebar = useDisclosure();
  const { isMobile, isTablet } = useBreakpoint();
  const isDrawerMode = isMobile || isTablet;

  const detailPanel = useDetailPanel({
    escapeDisabled: exportModal.isOpen || addModal.isOpen,
  });

  // Close sidebar when switching from drawer to static mode
  useEffect(() => {
    if (!isDrawerMode) sidebar.close();
  }, [isDrawerMode, sidebar]);

  useLockBodyScroll(exportModal.isOpen || addModal.isOpen);

  // Data hooks
  const {
    data: sortedData,
    total,
    totalPages,
    loading,
    error,
    refetch,
    addIndicator,
    existingValues,
    localIndicators,
  } = useDashboardData({
    apiFilters,
    sourceFilter: filters.source,
    sortConfig,
  });

  const {
    selectedIds,
    selectedArray,
    selectedCount,
    toggleSelection,
    clearSelection,
    getPageSelectionState,
    toggleAllOnPage,
  } = useSelection();

  // Actions hook
  const {
    tableWrapperRef,
    toasts,
    dismissToast,
    handleExportClick,
    handleExport,
    handleAddIndicator,
  } = useDashboardActions({
    selectedArray,
    selectedCount,
    clearSelection,
    clearFilters,
    addIndicator,
    openExportModal: exportModal.open,
    closeExportModal: exportModal.close,
    closeAddModal: addModal.close,
  });

  // Derived state
  const currentPageIds = useMemo(
    () => sortedData.map((indicator) => indicator.id),
    [sortedData]
  );

  const { allSelected, someSelected } = useMemo(
    () => getPageSelectionState(currentPageIds),
    [getPageSelectionState, currentPageIds]
  );

  const {
    indicator: activeIndicator,
    loading: indicatorLoading,
    error: indicatorError,
    refetch: refetchIndicator,
  } = useIndicator(detailPanel.activeRowId, { localIndicators });

  // Handlers
  const handleSelectRow = useCallback(
    (indicator: Indicator) => toggleSelection(indicator),
    [toggleSelection]
  );

  const handleSelectAll = useCallback(
    () => toggleAllOnPage(sortedData),
    [toggleAllOnPage, sortedData]
  );

  return {
    // Layout
    sidebar: {
      isDrawer: isDrawerMode,
      isOpen: sidebar.isOpen,
      close: sidebar.close,
      toggle: sidebar.toggle,
    },

    // Filters
    filters: {
      values: filters,
      setSearch,
      setSeverity,
      setType,
      setSource,
      clear: clearFilters,
    },

    // Table data
    table: {
      data: sortedData,
      loading,
      error,
      refetch,
      sortConfig,
      onSort: handleSort,
      selectedIds,
      allSelected,
      someSelected,
      onSelectRow: handleSelectRow,
      onSelectAll: handleSelectAll,
      page,
      onPageChange: setPage,
    },

    // Pagination
    pagination: {
      page,
      totalPages,
      total,
      limit: pageLimit,
      onPageChange: setPage,
    },

    // Detail panel
    detailPanel: {
      activeRowId: detailPanel.activeRowId,
      isOpen: detailPanel.isOpen,
      open: detailPanel.open,
      close: detailPanel.close,
      indicator: activeIndicator,
      loading: indicatorLoading,
      error: indicatorError,
      refetch: refetchIndicator,
    },

    // Selection
    selection: {
      count: selectedCount,
      array: selectedArray,
    },

    // Export modal
    exportModal: {
      isOpen: exportModal.isOpen,
      close: exportModal.close,
      onExportClick: handleExportClick,
      onExport: handleExport,
    },

    // Add indicator modal
    addModal: {
      isOpen: addModal.isOpen,
      open: addModal.open,
      close: addModal.close,
      onAdd: handleAddIndicator,
      existingValues,
    },

    // Toast notifications
    toast: {
      toasts,
      dismiss: dismissToast,
    },

    // Refs
    refs: {
      tableWrapper: tableWrapperRef,
    },
  };
}
