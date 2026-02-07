/**
 * Threat Intelligence Dashboard
 *
 * Main application component with state management for filters,
 * pagination, sorting, and row selection.
 */

import { useState, useMemo, useCallback } from 'react';
import { AppLayout, Sidebar, PageHeader } from './components/layout';
import { StatsRow, Toolbar, Pagination, type ToolbarFilters } from './components/dashboard';
import { DataTable, type SortConfig, type SortColumn } from './components/table';
import { useIndicators } from './hooks/useIndicators';
import { useDebounce } from './hooks/useDebounce';
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

  // Selected row state
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  // Filter by source client-side (API doesn't support source filter)
  const filteredData = useMemo(() => {
    if (!filters.source) return rawData;
    return rawData.filter((indicator) => indicator.source === filters.source);
  }, [rawData, filters.source]);

  // Sort data client-side
  const sortedData = useMemo(
    () => sortIndicators(filteredData, sortConfig),
    [filteredData, sortConfig]
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

  const handleSelectRow = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleRowClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <AppLayout>
      <Sidebar />
      <main className="flex flex-col overflow-x-hidden">
        <PageHeader
          title="Threat Intelligence Dashboard"
          subtitle="Real-time threat indicators and campaign intelligence"
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
        />

        {/* Data Table */}
        <DataTable
          data={sortedData}
          loading={loading}
          error={error}
          selectedId={selectedId}
          sortConfig={sortConfig}
          onSort={handleSort}
          onSelectRow={handleSelectRow}
          onRowClick={handleRowClick}
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
      </main>
    </AppLayout>
  );
}

export default App;
