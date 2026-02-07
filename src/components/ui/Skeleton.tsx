interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton loading placeholder with shimmer animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-bg-elevated via-bg-card to-bg-elevated
        bg-[length:200%_100%]
        animate-shimmer
        rounded-sm
        ${className}
      `}
      aria-hidden="true"
    />
  );
}
