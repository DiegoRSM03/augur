/**
 * Threat Intelligence Dashboard
 *
 * Main application component with state management for filters,
 * pagination, sorting, row selection, and export functionality.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AppLayout, Sidebar, PageHeader } from './components/layout';
import { StatsRow, Toolbar, Pagination, type ToolbarFilters } from './components/dashboard';
import { DataTable, type SortConfig, type SortColumn } from './components/table';
import { DetailPanel } from './components/detail';
import { ExportModal } from './components/export';
import { AddIndicatorModal } from './components/indicator';
import { ToastContainer } from './components/ui';
import { useIndicators } from './hooks/useIndicators';
import { useIndicator } from './hooks/useIndicator';
import { useDebounce } from './hooks/useDebounce';
import { useSelection } from './hooks/useSelection';
import { useToast } from './hooks/useToast';
import { useLocalIndicators } from './hooks/useLocalIndicators';
import { exportIndicatorsToCsv } from './utils/exportCsv';
import type { IndicatorType, Severity, Indicator } from './types/indicator';

// Default limit per page
const PAGE_LIMIT = 20;

// Known sources for the source filter dropdown
const KNOWN_SOURCES = [
  'AbuseIPDB',
  'VirusTotal',
  'OTX AlienVault',
  'Emerging Threats',
  'Silent Push',
  'MalwareBazaar',
  'PhishTank',
  'GreyNoise',
  'URLhaus',
];

/**
 * Sort indicators client-side
 */
function sortIndicators(
  data: Indicator[],
  sortConfig: SortConfig
): Indicator[] {
  if (!sortConfig.column) return data;

  return [...data].sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.column) {
      case 'indicator':
        comparison = a.value.localeCompare(b.value);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'severity': {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      }
      case 'confidence':
        comparison = a.confidence - b.confidence;
        break;
      case 'source':
        comparison = a.source.localeCompare(b.source);
        break;
      case 'lastSeen':
        comparison =
          new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
        break;
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

function App() {
  // Filter state
  const [filters, setFilters] = useState<ToolbarFilters>({
    search: '',
    severity: '',
    type: '',
    source: '',
  });

  // Pagination state
  const [page, setPage] = useState(1);

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'lastSeen',
    direction: 'desc',
  });

  // Active row state (for detail panel)
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Add Indicator modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Reference to the table wrapper for scrolling
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // Local indicators (in-memory storage for new indicators)
  const { localIndicators, addIndicator, localValues } = useLocalIndicators();

  // Multi-select state (for export) - stores full indicator objects
  const {
    selectedIds,
    selectedArray,
    selectedCount,
    toggleSelection,
    clearSelection,
    getPageSelectionState,
    toggleAllOnPage,
  } = useSelection();

  // Toast notifications
  const { toasts, showToast, dismissToast } = useToast();

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 300);

  // Build API filters
  const apiFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      severity: (filters.severity || undefined) as Severity | undefined,
      type: (filters.type || undefined) as IndicatorType | undefined,
      page,
      limit: PAGE_LIMIT,
    }),
    [debouncedSearch, filters.severity, filters.type, page]
  );

  // Fetch indicators
  const {
    data: rawData,
    total,
    totalPages,
    loading,
    error,
    refetch,
  } = useIndicators(apiFilters);

  // Merge local indicators with API data (local indicators first)
  const mergedData = useMemo(() => {
    return [...localIndicators, ...rawData];
  }, [localIndicators, rawData]);

  // Filter by source client-side (API doesn't support source filter)
  const filteredData = useMemo(() => {
    if (!filters.source) return mergedData;
    return mergedData.filter((indicator) => indicator.source === filters.source);
  }, [mergedData, filters.source]);

  // Sort data client-side
  const sortedData = useMemo(
    () => sortIndicators(filteredData, sortConfig),
    [filteredData, sortConfig]
  );

  // Get current page IDs for select all functionality
  const currentPageIds = useMemo(
    () => sortedData.map((indicator) => indicator.id),
    [sortedData]
  );

  // Get page selection state
  const { allSelected, someSelected } = useMemo(
    () => getPageSelectionState(currentPageIds),
    [getPageSelectionState, currentPageIds]
  );

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1); // Reset to first page on search
  }, []);

  const handleSeverityChange = useCallback((value: Severity | '') => {
    setFilters((prev) => ({ ...prev, severity: value }));
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((value: IndicatorType | '') => {
    setFilters((prev) => ({ ...prev, type: value }));
    setPage(1);
  }, []);

  const handleSourceChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, source: value }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', severity: '', type: '', source: '' });
    setPage(1);
  }, []);

  const handleSort = useCallback((column: SortColumn) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Handle checkbox selection - needs full indicator object
  const handleSelectRow = useCallback(
    (indicator: Indicator) => {
      toggleSelection(indicator);
    },
    [toggleSelection]
  );

  const handleRowClick = useCallback((id: string) => {
    setActiveRowId(id);
  }, []);

  // Handle select all - needs full indicator objects for current page
  const handleSelectAll = useCallback(() => {
    toggleAllOnPage(sortedData);
  }, [toggleAllOnPage, sortedData]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveRowId(null);
  }, []);

  // Export handlers
  const handleExportClick = useCallback(() => {
    if (selectedCount === 0) {
      showToast('No indicators selected', 'info');
      return;
    }
    setIsExportModalOpen(true);
  }, [selectedCount, showToast]);

  const handleExportModalClose = useCallback(() => {
    setIsExportModalOpen(false);
  }, []);

  // Add Indicator handlers
  const handleAddIndicatorClick = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleAddIndicator = useCallback(
    (indicatorData: Omit<Indicator, 'id'>) => {
      // Add the indicator to local storage
      addIndicator(indicatorData);

      // Close modal
      setIsAddModalOpen(false);

      // Show success toast
      showToast('Indicator added successfully', 'success');

      // Reset filters to show all indicators
      setFilters({ search: '', severity: '', type: '', source: '' });

      // Go to page 1
      setPage(1);

      // Scroll to top of table
      setTimeout(() => {
        tableWrapperRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    },
    [addIndicator, showToast]
  );

  // Get all existing indicator values for duplicate detection
  const existingValues = useMemo(() => {
    const apiValues = rawData.map((indicator) => indicator.value);
    return [...localValues, ...apiValues];
  }, [rawData, localValues]);

  const handleExport = useCallback(
    (idsToExport: string[]) => {
      // Get the indicators to export from selectedArray (stored in memory)
      const indicatorsToExport = selectedArray.filter((indicator) =>
        idsToExport.includes(indicator.id)
      );

      if (indicatorsToExport.length === 0) {
        showToast('No indicators to export', 'error');
        return;
      }

      // Generate and download CSV
      exportIndicatorsToCsv(indicatorsToExport);

      // Close modal, show toast, clear selections
      setIsExportModalOpen(false);
      showToast(
        `Successfully exported ${indicatorsToExport.length} indicator${indicatorsToExport.length !== 1 ? 's' : ''}`,
        'success'
      );
      clearSelection();
    },
    [selectedArray, showToast, clearSelection]
  );

  // Fetch selected indicator details
  const {
    indicator: activeIndicator,
    loading: indicatorLoading,
    error: indicatorError,
    refetch: refetchIndicator,
  } = useIndicator(activeRowId);

  // Handle Escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeRowId && !isExportModalOpen && !isAddModalOpen) {
        handleClosePanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeRowId, isExportModalOpen, isAddModalOpen, handleClosePanel]);

  return (
    <AppLayout>
      <Sidebar />
      <main className="flex flex-col overflow-x-hidden">
        <PageHeader
          title="Threat Intelligence Dashboard"
          subtitle="Real-time threat indicators and campaign intelligence"
          onExport={handleExportClick}
          onAddIndicator={handleAddIndicatorClick}
        />

        {/* Stats Row */}
        <StatsRow />

        {/* Toolbar / Filters */}
        <Toolbar
          filters={filters}
          onSearchChange={handleSearchChange}
          onSeverityChange={handleSeverityChange}
          onTypeChange={handleTypeChange}
          onSourceChange={handleSourceChange}
          onClearFilters={handleClearFilters}
          sources={KNOWN_SOURCES}
          selectedCount={selectedCount}
        />

        {/* Data Table + Detail Panel Container */}
        <div className="flex flex-1">
          {/* Content Area (Table + Pagination) */}
          <div ref={tableWrapperRef} className="flex flex-col flex-1 relative overflow-auto">
            {/* Data Table */}
            <DataTable
              data={sortedData}
              loading={loading}
              error={error}
              selectedIds={selectedIds}
              activeRowId={activeRowId}
              sortConfig={sortConfig}
              onSort={handleSort}
              onSelectRow={handleSelectRow}
              onRowClick={handleRowClick}
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              someSelected={someSelected}
              onClearFilters={handleClearFilters}
              onRetry={refetch}
            />

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PAGE_LIMIT}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Detail Panel */}
          {activeRowId && (
            <DetailPanel
              indicator={activeIndicator}
              loading={indicatorLoading}
              error={indicatorError}
              onClose={handleClosePanel}
              onRetry={refetchIndicator}
            />
          )}
        </div>
      </main>

      {/* Export Modal */}
      {isExportModalOpen && (
        <ExportModal
          indicators={selectedArray}
          onClose={handleExportModalClose}
          onExport={handleExport}
        />
      )}

      {/* Add Indicator Modal */}
      <AddIndicatorModal
        isOpen={isAddModalOpen}
        existingValues={existingValues}
        onClose={handleAddModalClose}
        onAdd={handleAddIndicator}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppLayout>
  );
}

export default App;
