import { Button, ThemeToggle } from '../../ui';
import { HamburgerIcon, DownloadIcon, PlusIcon } from '../../ui/icons';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onExport?: () => void;
  onAddIndicator?: () => void;
  onMenuToggle?: () => void;
}

function LiveIndicator() {
  return (
    <span className="hidden md:flex items-center gap-1.5 text-xs text-text-tertiary mr-2">
      <span className="w-1.5 h-1.5 rounded-full bg-status-active shadow-[0_0_6px_var(--tw-shadow-color)] shadow-status-active" />
      Live feed
    </span>
  );
}

export function PageHeader({ title, subtitle, onExport, onAddIndicator, onMenuToggle }: PageHeaderProps) {
  return (
    <header className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-border-subtle flex items-center justify-between bg-bg-surface sticky top-0 z-10">
      <div className="flex items-center gap-3">
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

      <div className="flex items-center gap-3">
        <LiveIndicator />
        <ThemeToggle />
        <Button variant="secondary" size="sm" onClick={onExport} className="hidden sm:inline-flex">
          <DownloadIcon className="w-3.5 h-3.5" />
          Export
        </Button>
        <Button variant="primary" size="sm" onClick={onAddIndicator} className="hidden sm:inline-flex">
          <PlusIcon className="w-3.5 h-3.5" />
          Add Indicator
        </Button>
      </div>
    </header>
  );
}
