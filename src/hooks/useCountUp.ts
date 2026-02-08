import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;
  enabled?: boolean;
}

/**
 * Animates a number from a previous value (or 0) to the current value
 * using requestAnimationFrame over a fixed duration.
 */
export function useCountUp(
  value: number,
  { duration = 800, enabled = true }: UseCountUpOptions = {}
): number {
  const [displayValue, setDisplayValue] = useState(enabled ? 0 : value);
  const rafRef = useRef<number | null>(null);
  // Tracks the last animated value — used as the starting point for the next animation.
  // Updated only during animation frames and when disabled, never in cleanup,
  // so React 18 StrictMode's double-invoke doesn't break the initial animation.
  const animatedValueRef = useRef(enabled ? 0 : value);

  useEffect(() => {
    if (!enabled) {
      animatedValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const startValue = animatedValueRef.current;
    const delta = value - startValue;

    if (delta === 0) {
      setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + delta * eased;

      animatedValueRef.current = current;
      setDisplayValue(Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Don't update animatedValueRef here — it retains the last
      // animated position, which is correct for StrictMode re-invokes.
    };
  }, [value, duration, enabled]);

  return displayValue;
}
