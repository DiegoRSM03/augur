interface ChevronIconProps {
  isOpen: boolean;
  className?: string;
}

export function ChevronIcon({ isOpen, className = 'w-4 h-4' }: ChevronIconProps) {
  return (
    <svg
      className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
