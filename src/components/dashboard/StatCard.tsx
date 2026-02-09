import { useReducedMotion } from 'motion/react';
import type { Severity } from '../../types/indicator';
import { useCountUp } from '../../hooks/useCountUp';

type StatVariant = 'total' | Severity;

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  variant?: StatVariant;
  icon?: React.ReactNode;
}

const variantValueStyles: Record<StatVariant, string> = {
  total: 'text-text-primary',
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
};

/**
 * Stat card component for displaying summary statistics
 */
export function StatCard({
  label,
  value,
  subtitle,
  variant = 'total',
  icon,
}: StatCardProps) {
  const reducedMotion = useReducedMotion();
  const numericValue = typeof value === 'number' ? value : null;
  const displayValue = useCountUp(numericValue ?? 0, {
    duration: 800,
    enabled: !reducedMotion && numericValue !== null,
  });

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
        className={`text-[26px] font-bold tracking-[-0.5px] leading-[1.1] ${variantValueStyles[variant]}`}
      >
        {numericValue !== null ? displayValue.toLocaleString() : value}
      </div>
      {subtitle && (
        <div className="text-[11px] text-text-tertiary">{subtitle}</div>
      )}
    </div>
  );
}
