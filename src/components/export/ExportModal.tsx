import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Indicator } from '../../types/indicator';
import { Badge, CloseIcon } from '../ui';

interface ExportModalProps {
  indicators: Indicator[];
  onClose: () => void;
  onExport: (selectedIds: string[]) => void;
}

/**
 * Export modal component
 * 
 * Displays a confirmation modal where users can review and adjust their
 * selection before exporting to CSV.
 */
export function ExportModal({ indicators, onClose, onExport }: ExportModalProps) {
  // Local selection state for the modal (initialized with all indicators)
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
    () => new Set(indicators.map((i) => i.id))
  );

  // Toggle individual item selection
  const toggleItem = useCallback((id: string) => {
    setLocalSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Count of selected items
  const selectedCount = useMemo(() => localSelectedIds.size, [localSelectedIds]);

  // Handle export button click
  const handleExport = useCallback(() => {
    onExport(Array.from(localSelectedIds));
  }, [localSelectedIds, onExport]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle overlay click to close modal
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="
        fixed inset-0
        bg-modal-overlay
        backdrop-blur-xs
        flex items-center justify-center
        z-100
      "
      onClick={handleOverlayClick}
    >
      <div
        className="
          bg-bg-modal
          border border-border
          rounded-xl
          shadow-modal
          w-[90vw] max-w-[600px]
          max-h-[70vh]
          flex flex-col
          overflow-hidden
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2
              id="export-modal-title"
              className="text-base font-bold text-text-primary"
            >
              Export Indicators
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Review your selection before exporting
            </p>
          </div>
          <button
            onClick={onClose}
            className="
              p-1.5 rounded-md
              text-text-tertiary hover:text-text-primary
              hover:bg-bg-card
              transition-colors
              cursor-pointer
            "
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body - Scrollable checkbox list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-1">
            {indicators.map((indicator) => (
              <label
                key={indicator.id}
                className="
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-md
                  cursor-pointer
                  hover:bg-bg-card
                  transition-colors
                "
              >
                <input
                  type="checkbox"
                  checked={localSelectedIds.has(indicator.id)}
                  onChange={() => toggleItem(indicator.id)}
                  className="accent-augur-blue shrink-0"
                />
                <span className="font-mono text-xs text-augur-blue truncate flex-1 min-w-0">
                  {indicator.value}
                </span>
                <Badge severity={indicator.severity} />
                <span className="text-xs text-text-secondary shrink-0">
                  {indicator.source}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border-subtle flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Exporting <span className="font-semibold text-text-primary">{selectedCount}</span> indicator{selectedCount !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="
                px-4 py-2
                text-sm font-semibold
                text-text-primary
                border border-border
                rounded-md
                hover:bg-bg-card hover:border-border-hover
                transition-colors
                cursor-pointer
              "
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedCount === 0}
              className="
                px-4 py-2
                text-sm font-semibold
                text-white
                bg-augur-blue
                border border-augur-blue
                rounded-md
                hover:brightness-110
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
