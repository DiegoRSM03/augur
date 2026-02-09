/**
 * Detail Panel Component
 *
 * Slide-in panel displaying full indicator details when a row is selected.
 * Shows value, classification, confidence, tags, timeline, and source.
 */

import { motion } from 'motion/react';
import type { Indicator } from '../../types/indicator';
import { Badge, Tag, Button, Skeleton } from '../ui';
import {
  formatRelativeTime,
  getTagColor,
  getTypeIcon,
  getTypeLabel,
} from '../../utils/formatters';

interface DetailPanelProps {
  indicator: Indicator | null;
  loading?: boolean;
  error?: Error | null;
  onClose: () => void;
  onRetry?: () => void;
}

/**
 * Format ISO date to readable format
 */
function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'Unknown';

  return date.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

/**
 * Format ISO date to YYYY-MM-DD
 */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'Unknown';

  return date.toISOString().slice(0, 10);
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Close button icon
 */
function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-5 h-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Error icon
 */
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

/**
 * Loading skeleton for detail panel
 */
function DetailSkeleton() {
  return (
    <div className="p-4 sm:p-5 flex-1">
      {/* Value section */}
      <div className="mb-6">
        <Skeleton className="w-12 h-3 mb-2" />
        <Skeleton className="w-full h-5" />
      </div>

      {/* Classification section */}
      <div className="mb-6">
        <Skeleton className="w-20 h-3 mb-2" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-12 h-4" />
        </div>
      </div>

      {/* Confidence section */}
      <div className="mb-6">
        <Skeleton className="w-24 h-3 mb-2" />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton className="w-[120px] h-1.5" />
          <Skeleton className="w-10 h-5" />
        </div>
      </div>

      {/* Tags section */}
      <div className="mb-6">
        <Skeleton className="w-10 h-3 mb-2" />
        <div className="flex gap-1.5 flex-wrap mt-1">
          <Skeleton className="w-14 h-5" />
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-12 h-5" />
        </div>
      </div>

      {/* Timeline section */}
      <div className="mb-6">
        <Skeleton className="w-16 h-3 mb-2" />
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="flex justify-between py-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </div>

      {/* Source section */}
      <div className="mb-6">
        <Skeleton className="w-14 h-3 mb-2" />
        <div className="flex justify-between py-2 border-b border-border-subtle">
          <Skeleton className="w-14 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

/**
 * Error state for detail panel
 */
function DetailError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
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

/**
 * Section label component
 */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[1px] text-text-tertiary mb-2">
      {children}
    </div>
  );
}

/**
 * Timeline row component
 */
function TimelineRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border-subtle last:border-b-0">
      <span className="text-xs text-text-secondary">{label}</span>
      <span
        className={`text-xs font-semibold ${highlight ? 'text-augur-blue' : 'text-text-primary'}`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Detail Panel Component
 */
export function DetailPanel({
  indicator,
  loading = false,
  error = null,
  onClose,
  onRetry,
}: DetailPanelProps) {
  // Get severity color for confidence bar
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: 'bg-severity-critical',
      high: 'bg-severity-high',
      medium: 'bg-severity-medium',
      low: 'bg-severity-low',
    };
    return colors[severity] ?? 'bg-text-tertiary';
  };

  const getSeverityTextColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: 'text-severity-critical',
      high: 'text-severity-high',
      medium: 'text-severity-medium',
      low: 'text-severity-low',
    };
    return colors[severity] ?? 'text-text-primary';
  };

  return (
    <motion.aside
      className="
        fixed inset-0 z-30 w-full
        md:relative md:inset-auto md:z-auto md:w-[400px]
        bg-bg-surface
        md:border-l border-border-subtle
        h-full
        overflow-y-auto
        shadow-elevated
        flex flex-col shrink-0
      "
      role="complementary"
      aria-label="Indicator details"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="px-5 py-4 border-b border-border-subtle flex items-center justify-between sticky top-0 bg-bg-surface z-10">
        <h3 className="text-sm font-semibold">Indicator Details</h3>
        <button
          onClick={onClose}
          className="
            p-1.5 rounded-md
            text-text-secondary hover:text-text-primary
            hover:bg-bg-card
            transition-colors duration-150
            cursor-pointer
          "
          aria-label="Close panel"
        >
          <CloseIcon />
        </button>
      </header>

      {/* Body */}
      {loading && <DetailSkeleton />}

      {error && <DetailError message={error.message} onRetry={onRetry} />}

      {!loading && !error && indicator && (
        <>
          <div className="p-4 sm:p-5 flex-1">
            {/* Value */}
            <section className="mb-6">
              <SectionLabel>Value</SectionLabel>
              <div className="font-mono text-[13px] text-augur-blue break-all">
                {indicator.value}
              </div>
            </section>

            {/* Classification */}
            <section className="mb-6">
              <SectionLabel>Classification</SectionLabel>
              <div className="flex gap-2 items-center mt-1">
                <Badge severity={indicator.severity} />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase text-text-secondary tracking-wide">
                  {getTypeIcon(indicator.type)} {getTypeLabel(indicator.type)}
                </span>
              </div>
            </section>

            {/* Confidence Score */}
            <section className="mb-6">
              <SectionLabel>Confidence Score</SectionLabel>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-[120px] h-1.5 bg-bg-elevated rounded overflow-hidden">
                  <div
                    className={`h-full rounded transition-all duration-300 ${getSeverityColor(indicator.severity)}`}
                    style={{ width: `${indicator.confidence}%` }}
                  />
                </div>
                <span
                  className={`text-[18px] font-bold font-mono ${getSeverityTextColor(indicator.severity)}`}
                >
                  {indicator.confidence}%
                </span>
              </div>
            </section>

            {/* Tags */}
            <section className="mb-6">
              <SectionLabel>Tags</SectionLabel>
              <div className="flex gap-1.5 flex-wrap mt-1">
                {indicator.tags.map((tag) => (
                  <Tag key={tag} color={getTagColor(tag)}>
                    {tag}
                  </Tag>
                ))}
                {indicator.tags.length === 0 && (
                  <span className="text-xs text-text-tertiary">No tags</span>
                )}
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-6">
              <SectionLabel>Timeline</SectionLabel>
              <div>
                <TimelineRow
                  label="First Seen"
                  value={formatDateTime(indicator.firstSeen)}
                />
                <TimelineRow
                  label="Last Seen"
                  value={formatRelativeTime(indicator.lastSeen)}
                />
                <TimelineRow
                  label="Augured On"
                  value={formatDate(indicator.firstSeen)}
                  highlight
                />
              </div>
            </section>

            {/* Source */}
            <section className="mb-6">
              <SectionLabel>Source</SectionLabel>
              <div>
                <TimelineRow label="Provider" value={indicator.source} />
                <TimelineRow label="Reports" value={formatNumber(Math.floor(indicator.confidence * 15))} />
              </div>
            </section>

            {/* Related Campaigns */}
            <section className="mb-6">
              <SectionLabel>Related Campaigns</SectionLabel>
              <div className="mt-1.5">
                <a
                  href="#"
                  className="text-augur-blue text-[12.5px] font-medium hover:underline cursor-pointer"
                >
                  {indicator.severity === 'critical' ? 'APT Campaign' : 'Threat Campaign'}
                </a>
                <span className="text-[11px] text-text-tertiary ml-1.5">
                  {indicator.severity === 'critical' ? 'UNC3886 • China' : 'Unknown Actor'}
                </span>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <footer className="p-4 sm:p-5 border-t border-border-subtle flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">
              Investigate
            </Button>
            <Button variant="danger" size="sm" className="flex-1">
              Block
            </Button>
          </footer>
        </>
      )}
    </motion.aside>
  );
}
