import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let time = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => cb(time += 16), 16) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return final value immediately when enabled is false', () => {
    const { result } = renderHook(() => useCountUp(500, { enabled: false }));
    expect(result.current).toBe(500);
  });

  it('should start from 0 and animate toward target when enabled', () => {
    const { result } = renderHook(() => useCountUp(100, { duration: 800 }));

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(100);
  });

  it('should update immediately when enabled changes to false', () => {
    const { result, rerender } = renderHook(
      ({ value, enabled }) => useCountUp(value, { enabled }),
      { initialProps: { value: 100, enabled: true } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 200, enabled: false });
    expect(result.current).toBe(200);
  });

  it('should handle value of 0', () => {
    const { result } = renderHook(() => useCountUp(0, { enabled: false }));
    expect(result.current).toBe(0);
  });

  it('should handle value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useCountUp(value, { duration: 800 }),
      { initialProps: { value: 100 } }
    );

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(result.current).toBe(100);

    rerender({ value: 200 });

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(result.current).toBe(200);
  });
});
