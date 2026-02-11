import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Select, Button } from '../../ui';
import { SearchIcon, FilterIcon } from '../../ui/icons';
import type { IndicatorType, Severity, ToolbarFilters } from '../../../types';

interface ToolbarProps {
  filters: ToolbarFilters;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: Severity | '') => void;
  onTypeChange: (value: IndicatorType | '') => void;
  onSourceChange: (value: string) => void;
  onClearFilters: () => void;
  sources?: readonly string[];
  selectedCount?: number;
}

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'ip', label: 'IP Address' },
  { value: 'domain', label: 'Domain' },
  { value: 'hash', label: 'File Hash' },
  { value: 'url', label: 'URL' },
];

function SelectionBadge({ count }: { count: number }) {
  return (
    <span
      className="
        inline-flex items-center
        px-2.5 py-1
        text-xs font-semibold
        text-augur-blue
        bg-augur-blue-dim
        rounded-full
      "
    >
      {count} selected
    </span>
  );
}

function FilterDropdowns({
  filters,
  sourceOptions,
  onSeverityChange,
  onTypeChange,
  onSourceChange,
}: {
  filters: ToolbarFilters;
  sourceOptions: { value: string; label: string }[];
  onSeverityChange: (value: Severity | '') => void;
  onTypeChange: (value: IndicatorType | '') => void;
  onSourceChange: (value: string) => void;
}) {
  return (
    <>
      <Select
        options={severityOptions}
        value={filters.severity}
        onChange={(e) => onSeverityChange(e.target.value as Severity | '')}
      />
      <Select
        options={typeOptions}
        value={filters.type}
        onChange={(e) => onTypeChange(e.target.value as IndicatorType | '')}
      />
      <Select
        options={sourceOptions}
        value={filters.source}
        onChange={(e) => onSourceChange(e.target.value)}
      />
    </>
  );
}

export function Toolbar({
  filters,
  onSearchChange,
  onSeverityChange,
  onTypeChange,
  onSourceChange,
  onClearFilters,
  sources = [],
  selectedCount = 0,
}: ToolbarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    ...sources.map((source) => ({ value: source, label: source })),
  ];

  const activeFilterCount =
    (filters.severity ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.source ? 1 : 0);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.type !== '' ||
    filters.source !== '';

  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 bg-bg-surface border-b border-border-subtle">
      {/* Top row: Search + filter toggle (mobile) / full inline layout (desktop) */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="w-full md:w-[260px]">
          <Input
            icon={<SearchIcon />}
            placeholder="Search indicators..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter toggle button — visible below md */}
        <button
          onClick={() => setFiltersExpanded((prev) => !prev)}
          className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-text-secondary text-sm font-medium hover:bg-bg-card hover:text-text-primary transition-colors duration-150 cursor-pointer"
          aria-label="Toggle filters"
          aria-expanded={filtersExpanded}
        >
          <FilterIcon />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-augur-blue text-white text-[10px] font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Divider — visible on md+ */}
        <div className="hidden md:block w-px h-6 bg-border mx-2" />

        {/* Filter dropdowns — always visible on md+ */}
        <div className="hidden md:flex items-center gap-2">
          <FilterDropdowns
            filters={filters}
            sourceOptions={sourceOptions}
            onSeverityChange={onSeverityChange}
            onTypeChange={onTypeChange}
            onSourceChange={onSourceChange}
          />
        </div>

        {/* Selection count badge and clear filters (right-aligned) */}
        <div className="ml-auto flex items-center gap-3">
          {selectedCount > 0 && <SelectionBadge count={selectedCount} />}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="hidden md:inline-flex">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Expandable filter row — mobile/tablet only */}
      <AnimatePresence>
        {filtersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <FilterDropdowns
                filters={filters}
                sourceOptions={sourceOptions}
                onSeverityChange={onSeverityChange}
                onTypeChange={onTypeChange}
                onSourceChange={onSourceChange}
              />
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { ToolbarFilters } from '../../../types';
