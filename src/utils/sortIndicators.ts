import type { Indicator } from '../types/indicator';
import type { SortConfig } from '../components/table';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 } as const;

export function sortIndicators(
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
      case 'severity':
        comparison = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        break;
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
