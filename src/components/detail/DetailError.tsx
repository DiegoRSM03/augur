import { Button } from '../ui';
import { AlertCircleIcon } from '../ui/icons';

interface DetailErrorProps {
  message: string;
  onRetry?: () => void;
}

export function DetailError({ message, onRetry }: DetailErrorProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 text-center">
      <AlertCircleIcon className="w-12 h-12 text-severity-critical opacity-50" />
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
