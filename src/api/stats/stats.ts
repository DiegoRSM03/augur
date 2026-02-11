/**
 * Stats API Client
 */

import type { Stats } from '../../types/stats';

const API_BASE = '/api';

/**
 * Fetch dashboard statistics
 */
export async function fetchStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE}/stats`);

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}
