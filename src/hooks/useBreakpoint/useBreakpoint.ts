import { useMediaQuery } from '../useMediaQuery';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

/**
 * Returns named booleans for the current breakpoint.
 * Exactly one boolean is true at any time.
 *
 * mobile:  0 – 480px
 * tablet:  481 – 768px
 * laptop:  769 – 1024px
 * desktop: 1025px+
 */
export function useBreakpoint(): Breakpoints {
  const aboveSm = useMediaQuery('(min-width: 481px)');
  const aboveMd = useMediaQuery('(min-width: 769px)');
  const aboveLg = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile: !aboveSm,
    isTablet: aboveSm && !aboveMd,
    isLaptop: aboveMd && !aboveLg,
    isDesktop: aboveLg,
  };
}
