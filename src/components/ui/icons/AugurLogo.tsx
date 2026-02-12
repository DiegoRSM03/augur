interface AugurLogoProps {
  className?: string;
}

export function AugurLogo({ className = 'w-7 h-7' }: AugurLogoProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
    </svg>
  );
}
