import { motion, useReducedMotion } from 'motion/react';
import type { Severity } from '../../types/indicator';
import { useCountUp } from '../../hooks/useCountUp';

type StatVariant = 'total' | Severity;

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  variant?: StatVariant;
  icon?: React.ReactNode;
  total?: number;
}

const variantValueStyles: Record<StatVariant, string> = {
  total: 'text-text-primary',
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
};

const severityBarColors: Record<Severity, string> = {
  critical: 'var(--color-critical)',
  high: 'var(--color-high)',
  medium: 'var(--color-medium)',
  low: 'var(--color-low)',
};

const severityVariants: Set<string> = new Set(['critical', 'high', 'medium', 'low']);

/**
 * Stat card component for displaying summary statistics
 */
export function StatCard({
  label,
  value,
  subtitle,
  variant = 'total',
  icon,
  total,
}: StatCardProps) {
  const reducedMotion = useReducedMotion();
  const numericValue = typeof value === 'number' ? value : null;
  const displayValue = useCountUp(numericValue ?? 0, {
    duration: 800,
    enabled: !reducedMotion && numericValue !== null,
  });

  const showProgressBar =
    total !== undefined && total > 0 && severityVariants.has(variant);

  const ratio = showProgressBar ? (numericValue ?? 0) / total : 0;

  return (
    <div
      className="
        bg-bg-card
        border border-border-subtle
        rounded-lg
        px-5 py-4
        flex flex-col gap-1
        h-full
        transition-colors duration-200
        hover:border-border-hover
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.8px] text-text-tertiary">
          {label}
        </span>
        {icon && (
          <span className="w-[16px] h-[16px] text-text-tertiary">{icon}</span>
        )}
      </div>
      <div
        className={`text-[26px] font-bold tracking-tight leading-tight ${variantValueStyles[variant]}`}
      >
        {numericValue !== null ? displayValue.toLocaleString() : value}
      </div>
      {subtitle && (
        <div className="text-[11px] text-text-tertiary">{subtitle}</div>
      )}
      {showProgressBar && (
        <div
          className="h-1 w-full rounded-sm overflow-hidden mt-1"
          style={{ background: 'var(--color-confidence-track)' }}
          data-testid="progress-bar"
        >
          <motion.div
            className="h-full w-full rounded-sm"
            style={{
              background: severityBarColors[variant as Severity],
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: ratio }}
            transition={{
              duration: reducedMotion ? 0 : 0.4,
              ease: 'easeOut',
            }}
          />
        </div>
      )}
    </div>
  );
}
