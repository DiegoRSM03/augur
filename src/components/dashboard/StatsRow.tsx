import { motion, useReducedMotion } from 'motion/react';
import { useStats } from '../../hooks/useStats';
import { Skeleton } from '../ui';
import { ShieldIcon } from '../ui/icons';
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

const cardConfigs: CardConfig[] = [
  { label: 'Total Indicators', key: 'total', subtitle: '\u2191 12% from last week', variant: 'total', icon: <ShieldIcon /> },
  { label: 'Critical', key: 'critical', subtitle: 'Requires immediate action', variant: 'critical' },
  { label: 'High', key: 'high', subtitle: 'Active monitoring', variant: 'high' },
  { label: 'Medium', key: 'medium', subtitle: 'Under review', variant: 'medium' },
  { label: 'Low', key: 'low', subtitle: 'Informational', variant: 'low' },
];

function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`bg-bg-card border border-border-subtle rounded-lg px-5 py-4 ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function StatsRowError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8">
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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-8" key={animationKey}>
      {cardConfigs.map((config, index) => (
        <motion.div
          key={config.key}
          className={`h-full ${index === 0 ? 'col-span-2 md:col-span-1' : ''}`}
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
          />
        </motion.div>
      ))}
    </div>
  );
}
