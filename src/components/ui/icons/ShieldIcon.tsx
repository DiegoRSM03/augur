interface ShieldIconProps {
  className?: string;
  strokeWidth?: number;
}

export function ShieldIcon({
  className = 'w-full h-full',
  strokeWidth = 2,
}: ShieldIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
