import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStats } from './useStats';
import * as api from '../api/indicators';

// Mock the API module
vi.mock('../api/indicators', () => ({
  fetchStats: vi.fn(),
}));

const mockStats = {
  total: 2847,
  critical: 342,
  high: 798,
  medium: 1139,
  low: 568,
  byType: {
    ip: 1200,
    domain: 800,
    hash: 500,
    url: 347,
  },
};

describe('useStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch stats on mount', async () => {
    vi.mocked(api.fetchStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toBeNull();

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch stats';
    vi.mocked(api.fetchStats).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.stats).toBeNull();
  });

  it('should provide a refetch function', async () => {
    vi.mocked(api.fetchStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(api.fetchStats).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(api.fetchStats).mockRejectedValue('string error');

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch stats');
  });

  it('should return all stat values correctly', async () => {
    vi.mocked(api.fetchStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats?.total).toBe(2847);
    expect(result.current.stats?.critical).toBe(342);
    expect(result.current.stats?.high).toBe(798);
    expect(result.current.stats?.medium).toBe(1139);
    expect(result.current.stats?.low).toBe(568);
  });
});
