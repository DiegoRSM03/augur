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
import { useLockBodyScroll } from './hooks/useLockBodyScroll';
import { useBreakpoint } from './hooks/useBreakpoint';
import { exportIndicatorsToCsv } from './utils/exportCsv';
import type { IndicatorType, Severity, Indicator } from './types/indicator';

const PAGE_LIMIT = 20;

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
  const [filters, setFilters] = useState<ToolbarFilters>({
    search: '',
    severity: '',
    type: '',
    source: '',
  });

  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'lastSeen',
    direction: 'desc',
  });

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const isDrawerMode = isMobile || isTablet;

  useEffect(() => {
    if (!isDrawerMode) setSidebarOpen(false);
  }, [isDrawerMode]);

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  useLockBodyScroll(isExportModalOpen || isAddModalOpen);

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const { localIndicators, addIndicator, localValues } = useLocalIndicators();

  const {
    selectedIds,
    selectedArray,
    selectedCount,
    toggleSelection,
    clearSelection,
    getPageSelectionState,
    toggleAllOnPage,
  } = useSelection();

  const { toasts, showToast, dismissToast } = useToast();

  const debouncedSearch = useDebounce(filters.search, 300);

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

  const {
    data: rawData,
    total,
    totalPages,
    loading,
    error,
    refetch,
  } = useIndicators(apiFilters);

  const mergedData = useMemo(() => {
    return [...localIndicators, ...rawData];
  }, [localIndicators, rawData]);

  // API doesn't support source filter
  const filteredData = useMemo(() => {
    if (!filters.source) return mergedData;
    return mergedData.filter((indicator) => indicator.source === filters.source);
  }, [mergedData, filters.source]);

  const sortedData = useMemo(
    () => sortIndicators(filteredData, sortConfig),
    [filteredData, sortConfig]
  );

  const currentPageIds = useMemo(
    () => sortedData.map((indicator) => indicator.id),
    [sortedData]
  );

  const { allSelected, someSelected } = useMemo(
    () => getPageSelectionState(currentPageIds),
    [getPageSelectionState, currentPageIds]
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
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

  const handleSelectRow = useCallback(
    (indicator: Indicator) => {
      toggleSelection(indicator);
    },
    [toggleSelection]
  );

  const handleRowClick = useCallback((id: string) => {
    setActiveRowId(id);
  }, []);

  const handleSelectAll = useCallback(() => {
    toggleAllOnPage(sortedData);
  }, [toggleAllOnPage, sortedData]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveRowId(null);
  }, []);

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

  const handleAddIndicatorClick = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleAddIndicator = useCallback(
    (indicatorData: Omit<Indicator, 'id'>) => {
      addIndicator(indicatorData);
      setIsAddModalOpen(false);
      showToast('Indicator added successfully', 'success');
      setFilters({ search: '', severity: '', type: '', source: '' });
      setPage(1);
      setTimeout(() => {
        tableWrapperRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    },
    [addIndicator, showToast]
  );

  const existingValues = useMemo(() => {
    const apiValues = rawData.map((indicator) => indicator.value);
    return [...localValues, ...apiValues];
  }, [rawData, localValues]);

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
      setIsExportModalOpen(false);
      showToast(
        `Successfully exported ${indicatorsToExport.length} indicator${indicatorsToExport.length !== 1 ? 's' : ''}`,
        'success'
      );
      clearSelection();
    },
    [selectedArray, showToast, clearSelection]
  );

  const {
    indicator: activeIndicator,
    loading: indicatorLoading,
    error: indicatorError,
    refetch: refetchIndicator,
  } = useIndicator(activeRowId, { localIndicators });

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
      <Sidebar
        isDrawer={isDrawerMode}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
      <main className="flex flex-col overflow-x-hidden">
        <PageHeader
          title="Threat Intelligence Dashboard"
          subtitle="Real-time threat indicators and campaign intelligence"
          onExport={handleExportClick}
          onAddIndicator={handleAddIndicatorClick}
          onMenuToggle={handleMenuToggle}
        />

        <StatsRow />

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

        <div className="flex flex-1">
          <div ref={tableWrapperRef} className="flex flex-col flex-1 relative overflow-auto">
            <DataTable
              data={sortedData}
              loading={loading}
              error={error}
              selectedIds={selectedIds}
              activeRowId={activeRowId}
              sortConfig={sortConfig}
              page={page}
              onSort={handleSort}
              onSelectRow={handleSelectRow}
              onRowClick={handleRowClick}
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              someSelected={someSelected}
              onClearFilters={handleClearFilters}
              onRetry={refetch}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PAGE_LIMIT}
              onPageChange={handlePageChange}
            />
          </div>

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

      {isExportModalOpen && (
        <ExportModal
          indicators={selectedArray}
          onClose={handleExportModalClose}
          onExport={handleExport}
        />
      )}

      <AddIndicatorModal
        isOpen={isAddModalOpen}
        existingValues={existingValues}
        onClose={handleAddModalClose}
        onAdd={handleAddIndicator}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppLayout>
  );
}

export default App;
