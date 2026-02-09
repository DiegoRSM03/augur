import { Button } from '../ui';

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-12 h-12 text-severity-critical opacity-50"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

interface DetailErrorProps {
  message: string;
  onRetry?: () => void;
}

export function DetailError({ message, onRetry }: DetailErrorProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 text-center">
      <ErrorIcon />
      <p className="mt-4 text-sm font-medium text-severity-critical">
        Failed to load indicator
      </p>
      <p className="mt-1 text-xs text-text-tertiary">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}
