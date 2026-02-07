import type { Severity } from '../../types/indicator';

interface BadgeProps {
  severity: Severity;
  className?: string;
}

const severityStyles: Record<Severity, string> = {
  critical:
    'bg-severity-critical-bg text-severity-critical border-severity-critical-border',
  high: 'bg-severity-high-bg text-severity-high border-severity-high-border',
  medium:
    'bg-severity-medium-bg text-severity-medium border-severity-medium-border',
  low: 'bg-severity-low-bg text-severity-low border-severity-low-border',
};

/**
 * Severity badge component for displaying threat levels
 */
export function Badge({ severity, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        rounded-sm
        text-xs font-semibold
        capitalize
        tracking-wide
        border
        ${severityStyles[severity]}
        ${className}
      `}
    >
      {severity}
    </span>
  );
}
