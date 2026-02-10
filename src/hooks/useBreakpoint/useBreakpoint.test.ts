import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';

// Mock useMediaQuery to control breakpoint thresholds
vi.mock('../useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
}));

import { useMediaQuery } from '../useMediaQuery';

const mockUseMediaQuery = vi.mocked(useMediaQuery);

describe('useBreakpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns isMobile when no breakpoint matches', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toEqual({
      isMobile: true,
      isTablet: false,
      isLaptop: false,
      isDesktop: false,
    });
  });

  it('returns isTablet when aboveSm matches but aboveMd does not', () => {
    mockUseMediaQuery.mockImplementation((query: string) => {
      if (query === '(min-width: 481px)') return true;
      return false;
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isLaptop: false,
      isDesktop: false,
    });
  });

  it('returns isLaptop when aboveMd matches but aboveLg does not', () => {
    mockUseMediaQuery.mockImplementation((query: string) => {
      if (query === '(min-width: 481px)') return true;
      if (query === '(min-width: 769px)') return true;
      return false;
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isLaptop: true,
      isDesktop: false,
    });
  });

  it('returns isDesktop when aboveLg matches', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isLaptop: false,
      isDesktop: true,
    });
  });
});
