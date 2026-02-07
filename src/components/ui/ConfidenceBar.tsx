import type { Severity } from '../../types/indicator';

interface ConfidenceBarProps {
  value: number; // 0-100
  severity?: Severity;
  showValue?: boolean;
  className?: string;
}

const severityColors: Record<Severity, string> = {
  critical: 'bg-severity-critical',
  high: 'bg-severity-high',
  medium: 'bg-severity-medium',
  low: 'bg-severity-low',
};

const severityTextColors: Record<Severity, string> = {
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
};

/**
 * Get severity level based on confidence value
 */
function getSeverityFromValue(value: number): Severity {
  if (value >= 80) return 'critical';
  if (value >= 60) return 'high';
  if (value >= 40) return 'medium';
  return 'low';
}

/**
 * Confidence bar component for displaying confidence scores
 */
export function ConfidenceBar({
  value,
  severity,
  showValue = true,
  className = '',
}: ConfidenceBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));
  const effectiveSeverity = severity ?? getSeverityFromValue(clampedValue);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-[60px] h-1 bg-bg-elevated rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm transition-all duration-300 ease-out ${severityColors[effectiveSeverity]}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showValue && (
        <span
          className={`text-xs font-semibold font-mono min-w-[28px] ${severityTextColors[effectiveSeverity]}`}
        >
          {clampedValue}
        </span>
      )}
    </div>
  );
}
