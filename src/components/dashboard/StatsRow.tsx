import { motion, useReducedMotion } from 'motion/react';
import { useStats } from '../../hooks/useStats';
import { Skeleton } from '../ui';
import { StatCard } from './StatCard';
import type { Severity } from '../../types/indicator';

type StatVariant = 'total' | Severity;

type NumericStatsKey = 'total' | 'critical' | 'high' | 'medium' | 'low';

interface CardConfig {
  label: string;
  key: NumericStatsKey;
  subtitle: string;
  variant: StatVariant;
  icon?: React.ReactNode;
}

/**
 * Shield icon for the total indicators card
 */
function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const cardConfigs: CardConfig[] = [
  { label: 'Total Indicators', key: 'total', subtitle: '\u2191 12% from last week', variant: 'total', icon: <ShieldIcon /> },
  { label: 'Critical', key: 'critical', subtitle: 'Requires immediate action', variant: 'critical' },
  { label: 'High', key: 'high', subtitle: 'Active monitoring', variant: 'high' },
  { label: 'Medium', key: 'medium', subtitle: 'Under review', variant: 'medium' },
  { label: 'Low', key: 'low', subtitle: 'Informational', variant: 'low' },
];

/**
 * Loading skeleton for stats row
 */
function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-3 px-8 py-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-card border border-border-subtle rounded-lg px-5 py-4"
        >
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * Error state for stats row
 */
function StatsRowError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="px-8 py-5">
      <div className="bg-bg-card border border-severity-critical-border rounded-lg p-6 text-center">
        <p className="text-severity-critical mb-2">Failed to load statistics</p>
        <p className="text-text-tertiary text-sm mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="text-augur-blue hover:underline text-sm cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/**
 * Stats row component displaying summary statistics
 */
export function StatsRow() {
  const { stats, loading, error, refetch } = useStats();
  const reducedMotion = useReducedMotion();

  if (loading) {
    return <StatsRowSkeleton />;
  }

  if (error) {
    return <StatsRowError message={error.message} onRetry={refetch} />;
  }

  if (!stats) {
    return null;
  }

  // Key by stats values to re-trigger entrance animation on data change
  const animationKey = `${stats.total}-${stats.critical}-${stats.high}-${stats.medium}-${stats.low}`;

  return (
    <div className="grid grid-cols-5 gap-3 px-8 py-5" key={animationKey}>
      {cardConfigs.map((config, index) => (
        <motion.div
          key={config.key}
          className="h-full"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : index * 0.1,
            duration: reducedMotion ? 0 : 0.25,
            ease: 'easeOut',
          }}
        >
          <StatCard
            label={config.label}
            value={stats[config.key]}
            subtitle={config.subtitle}
            variant={config.variant}
            icon={config.icon}
            total={config.variant !== 'total' ? stats.total : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}
