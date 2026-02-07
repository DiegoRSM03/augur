import { useStats } from '../../hooks/useStats';
import { Skeleton } from '../ui';
import { StatCard } from './StatCard';

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
          className="text-augur-blue hover:underline text-sm"
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

  if (loading) {
    return <StatsRowSkeleton />;
  }

  if (error) {
    return <StatsRowError message={error.message} onRetry={refetch} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-5 gap-3 px-8 py-5">
      <StatCard
        label="Total Indicators"
        value={stats.total}
        subtitle="↑ 12% from last week"
        variant="total"
        icon={<ShieldIcon />}
      />
      <StatCard
        label="Critical"
        value={stats.critical}
        subtitle="Requires immediate action"
        variant="critical"
      />
      <StatCard
        label="High"
        value={stats.high}
        subtitle="Active monitoring"
        variant="high"
      />
      <StatCard
        label="Medium"
        value={stats.medium}
        subtitle="Under review"
        variant="medium"
      />
      <StatCard
        label="Low"
        value={stats.low}
        subtitle="Informational"
        variant="low"
      />
    </div>
  );
}
