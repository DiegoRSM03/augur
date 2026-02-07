import { Input, Select, Button } from '../ui';
import type { IndicatorType, Severity } from '../../types/indicator';

interface ToolbarFilters {
  search: string;
  severity: Severity | '';
  type: IndicatorType | '';
  source: string;
}

interface ToolbarProps {
  filters: ToolbarFilters;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: Severity | '') => void;
  onTypeChange: (value: IndicatorType | '') => void;
  onSourceChange: (value: string) => void;
  onClearFilters: () => void;
  sources?: string[];
  selectedCount?: number;
}

/**
 * Search icon component
 */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
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

/**
 * Toolbar component with search and filter controls
 */
/**
 * Selection count badge component
 */
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
  const sourceOptions = [
    { value: '', label: 'All Sources' },
    ...sources.map((source) => ({ value: source, label: source })),
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.type !== '' ||
    filters.source !== '';

  return (
    <div className="px-8 py-4 flex items-center gap-3 bg-bg-surface border-b border-border-subtle flex-wrap">
      {/* Search input */}
      <div className="w-[260px]">
        <Input
          icon={<SearchIcon />}
          placeholder="Search indicators..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-2" />

      {/* Filter dropdowns */}
      <div className="flex items-center gap-2">
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
      </div>

      {/* Selection count badge and clear filters (right-aligned) */}
      <div className="ml-auto flex items-center gap-3">
        {selectedCount > 0 && <SelectionBadge count={selectedCount} />}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

export type { ToolbarFilters };
