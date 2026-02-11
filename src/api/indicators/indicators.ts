/**
 * Indicators API Client
 */

import type {
  Indicator,
  IndicatorFilters,
  PaginatedResponse,
} from '../../types/indicator';

const API_BASE = '/api';

/**
 * Fetch paginated list of indicators with optional filters
 */
export async function fetchIndicators(
  filters: IndicatorFilters = {}
): Promise<PaginatedResponse<Indicator>> {
  const params = new URLSearchParams();

  if (filters.page !== undefined) {
    params.set('page', String(filters.page));
  }
  if (filters.limit !== undefined) {
    params.set('limit', String(filters.limit));
  }
  if (filters.severity) {
    params.set('severity', filters.severity);
  }
  if (filters.type) {
    params.set('type', filters.type);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }

  const queryString = params.toString();
  const url = `${API_BASE}/indicators${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch indicators: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single indicator by ID
 */
export async function fetchIndicatorById(id: string): Promise<Indicator> {
  const response = await fetch(`${API_BASE}/indicators/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Indicator not found');
    }
    throw new Error(`Failed to fetch indicator: ${response.statusText}`);
  }

  return response.json();
}
