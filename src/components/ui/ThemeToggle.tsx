import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon } from './icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  
  const isDark = theme === 'dark';
  const ariaLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  
  // Set duration to 0 if user prefers reduced motion
  const duration = prefersReducedMotion ? 0 : 0.2;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={ariaLabel}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration }}
            className="flex items-center justify-center"
          >
            <MoonIcon />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration }}
            className="flex items-center justify-center"
          >
            <SunIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
