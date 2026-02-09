import { Button, ThemeToggle } from '../ui';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onExport?: () => void;
  onAddIndicator?: () => void;
  onMenuToggle?: () => void;
}

// Hamburger menu icon
function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Live status dot component
function LiveIndicator() {
  return (
    <span className="hidden md:flex items-center gap-1.5 text-xs text-text-tertiary mr-2">
      <span className="w-1.5 h-1.5 rounded-full bg-status-active shadow-[0_0_6px_var(--tw-shadow-color)] shadow-status-active" />
      Live feed
    </span>
  );
}

// Download icon for export button
const DownloadIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// Plus icon for add button
const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function PageHeader({ title, subtitle, onExport, onAddIndicator, onMenuToggle }: PageHeaderProps) {
  return (
    <header className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-border-subtle flex items-center justify-between bg-bg-surface sticky top-0 z-10">
      {/* Left side: Hamburger + Title and subtitle */}
      <div className="flex items-center gap-3">
        {/* Hamburger button — visible below md */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 -ml-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors duration-150 cursor-pointer"
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>
        )}
        <div className="h-12.5">
          <h1 className="text-lg sm:text-xl md:text-[20px] font-bold tracking-[-0.3px]">{title}</h1>
          <p className="hidden sm:block text-[12px] text-text-secondary mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Live indicator and action buttons */}
      <div className="flex items-center gap-3">
        <LiveIndicator />
        <ThemeToggle />
        <Button variant="secondary" size="sm" onClick={onExport} className="hidden sm:inline-flex">
          <DownloadIcon />
          Export
        </Button>
        <Button variant="primary" size="sm" onClick={onAddIndicator} className="hidden sm:inline-flex">
          <PlusIcon />
          Add Indicator
        </Button>
      </div>
    </header>
  );
}
