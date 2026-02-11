import { AppLayout, Sidebar, PageHeader } from './components/layout';
import { StatsRow, Toolbar, Pagination } from './components/dashboard';
import { DataTable } from './components/table';
import { DetailPanel } from './components/detail';
import { ExportModal } from './components/export';
import { AddIndicatorModal } from './components/indicator';
import { ToastContainer } from './components/ui';
import { useDashboard } from './hooks';

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

function App() {
  const dashboard = useDashboard({ pageLimit: PAGE_LIMIT });

  return (
    <AppLayout>
      <Sidebar
        isDrawer={dashboard.sidebar.isDrawer}
        isOpen={dashboard.sidebar.isOpen}
        onClose={dashboard.sidebar.close}
      />

      <main className="flex flex-col overflow-x-hidden">
        <PageHeader
          title="Threat Intelligence Dashboard"
          subtitle="Real-time threat indicators and campaign intelligence"
          onExport={dashboard.exportModal.onExportClick}
          onAddIndicator={dashboard.addModal.open}
          onMenuToggle={dashboard.sidebar.toggle}
        />

        <StatsRow />

        <Toolbar
          filters={dashboard.filters.values}
          onSearchChange={dashboard.filters.setSearch}
          onSeverityChange={dashboard.filters.setSeverity}
          onTypeChange={dashboard.filters.setType}
          onSourceChange={dashboard.filters.setSource}
          onClearFilters={dashboard.filters.clear}
          sources={KNOWN_SOURCES}
          selectedCount={dashboard.selection.count}
        />

        <div className="flex flex-1">
          <div
            ref={dashboard.refs.tableWrapper}
            className="flex flex-col flex-1 relative overflow-auto"
          >
            <DataTable
              data={dashboard.table.data}
              loading={dashboard.table.loading}
              error={dashboard.table.error}
              selectedIds={dashboard.table.selectedIds}
              activeRowId={dashboard.detailPanel.activeRowId}
              sortConfig={dashboard.table.sortConfig}
              page={dashboard.table.page}
              onSort={dashboard.table.onSort}
              onSelectRow={dashboard.table.onSelectRow}
              onRowClick={dashboard.detailPanel.open}
              onSelectAll={dashboard.table.onSelectAll}
              allSelected={dashboard.table.allSelected}
              someSelected={dashboard.table.someSelected}
              onClearFilters={dashboard.filters.clear}
              onRetry={dashboard.table.refetch}
            />

            <Pagination
              page={dashboard.pagination.page}
              totalPages={dashboard.pagination.totalPages}
              total={dashboard.pagination.total}
              limit={dashboard.pagination.limit}
              onPageChange={dashboard.pagination.onPageChange}
            />
          </div>

          {dashboard.detailPanel.isOpen && (
            <DetailPanel
              indicator={dashboard.detailPanel.indicator}
              loading={dashboard.detailPanel.loading}
              error={dashboard.detailPanel.error}
              onClose={dashboard.detailPanel.close}
              onRetry={dashboard.detailPanel.refetch}
            />
          )}
        </div>
      </main>

      {dashboard.exportModal.isOpen && (
        <ExportModal
          indicators={dashboard.selection.array}
          onClose={dashboard.exportModal.close}
          onExport={dashboard.exportModal.onExport}
        />
      )}

      <AddIndicatorModal
        isOpen={dashboard.addModal.isOpen}
        existingValues={dashboard.addModal.existingValues}
        onClose={dashboard.addModal.close}
        onAdd={dashboard.addModal.onAdd}
      />

      <ToastContainer
        toasts={dashboard.toast.toasts}
        onDismiss={dashboard.toast.dismiss}
      />
    </AppLayout>
  );
}

export default App;
