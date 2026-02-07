/**
 * Error State Component
 *
 * Displays an error message with optional retry action.
 * Used for API failures and other error conditions.
 */

import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Error icon
 */
function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-12 h-12 text-severity-critical opacity-50"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/**
 * Error state component for displaying errors with retry option
 */
export function ErrorState({ message, onRetry, className = '' }: ErrorStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-16 px-8
        text-center
        ${className}
      `}
    >
      <ErrorIcon />
      <p className="mt-4 text-sm font-medium text-severity-critical">
        Something went wrong
      </p>
      <p className="mt-1 text-xs text-text-tertiary max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}
