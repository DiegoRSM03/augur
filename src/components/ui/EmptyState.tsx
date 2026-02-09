import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function DefaultEmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-12 h-12 opacity-30"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filter criteria',
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-16 px-8
        text-text-tertiary text-center
        ${className}
      `}
    >
      {icon ?? <DefaultEmptyIcon />}
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs">{message}</p>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
