/**
 * Filter Types
 *
 * Types for filtering indicators in the dashboard.
 */

import type { IndicatorType, Severity } from './indicator';

export interface ToolbarFilters {
  search: string;
  severity: Severity | '';
  type: IndicatorType | '';
  source: string;
}
