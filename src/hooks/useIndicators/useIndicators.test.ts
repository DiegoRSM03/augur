import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIndicators } from './useIndicators';
import * as api from '../../api';

// Mock the API module
vi.mock('../../api', () => ({
  fetchIndicators: vi.fn(),
}));

const mockIndicator1 = {
  id: '1',
  value: '192.168.1.1',
  type: 'ip' as const,
  severity: 'critical' as const,
  source: 'AbuseIPDB',
  firstSeen: '2026-01-01T00:00:00Z',
  lastSeen: '2026-02-07T12:00:00Z',
  tags: ['tor-exit', 'botnet'],
  confidence: 94,
};

const mockIndicator2 = {
  id: '2',
  value: 'malware.example.com',
  type: 'domain' as const,
  severity: 'high' as const,
  source: 'VirusTotal',
  firstSeen: '2026-01-15T00:00:00Z',
  lastSeen: '2026-02-06T12:00:00Z',
  tags: ['c2', 'malware'],
  confidence: 78,
};

const mockIndicators = [mockIndicator1, mockIndicator2];

describe('useIndicators', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch indicators on mount', async () => {
    const mockResponse = {
      data: mockIndicators,
      total: 2,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(api.fetchIndicators).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useIndicators());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockIndicators);
    expect(result.current.total).toBe(2);
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('should pass filters to the API', async () => {
    const mockResponse = {
      data: [mockIndicator1],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(api.fetchIndicators).mockResolvedValue(mockResponse);

    const filters = {
      search: 'test',
      severity: 'critical' as const,
      type: 'ip' as const,
      page: 2,
      limit: 10,
    };

    const { result } = renderHook(() => useIndicators(filters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.fetchIndicators).toHaveBeenCalledWith(filters);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network error';
    vi.mocked(api.fetchIndicators).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useIndicators());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });

  it('should refetch when filters change', async () => {
    const mockResponse1 = {
      data: mockIndicators,
      total: 2,
      page: 1,
      totalPages: 1,
    };

    const mockResponse2 = {
      data: [mockIndicator1],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(api.fetchIndicators)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result, rerender } = renderHook(
      ({ filters }) => useIndicators(filters),
      { initialProps: { filters: {} } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockIndicators);

    // Change filters
    rerender({ filters: { severity: 'critical' as const } });

    await waitFor(() => {
      expect(result.current.data).toEqual([mockIndicator1]);
    });

    expect(api.fetchIndicators).toHaveBeenCalledTimes(2);
  });

  it('should provide a refetch function', async () => {
    const mockResponse = {
      data: mockIndicators,
      total: 2,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(api.fetchIndicators).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useIndicators());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(api.fetchIndicators).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle pagination correctly', async () => {
    const mockResponse = {
      data: mockIndicators,
      total: 100,
      page: 5,
      totalPages: 10,
    };

    vi.mocked(api.fetchIndicators).mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useIndicators({ page: 5, limit: 10 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.page).toBe(5);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.total).toBe(100);
  });
});
