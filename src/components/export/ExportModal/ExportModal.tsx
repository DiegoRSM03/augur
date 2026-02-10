import { useState, useMemo, useCallback } from 'react';
import type { Indicator } from '../../../types/indicator';
import { Badge, Button, Modal } from '../../ui';

interface ExportModalProps {
  indicators: Indicator[];
  onClose: () => void;
  onExport: (selectedIds: string[]) => void;
}

export function ExportModal({ indicators, onClose, onExport }: ExportModalProps) {
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
    () => new Set(indicators.map((i) => i.id))
  );

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

  const selectedCount = useMemo(() => localSelectedIds.size, [localSelectedIds]);

  const handleExport = useCallback(() => {
    onExport(Array.from(localSelectedIds));
  }, [localSelectedIds, onExport]);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      width="lg"
      aria-labelledby="export-modal-title"
    >
      <Modal.Header
        id="export-modal-title"
        title="Export Indicators"
        subtitle="Review your selection before exporting"
      />

      <Modal.Body className="p-6">
        <div className="space-y-1">
          {indicators.map((indicator) => (
            <ExportIndicatorRow
              key={indicator.id}
              indicator={indicator}
              isSelected={localSelectedIds.has(indicator.id)}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Exporting{' '}
            <span className="font-semibold text-text-primary">{selectedCount}</span>{' '}
            indicator{selectedCount !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={selectedCount === 0}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

interface ExportIndicatorRowProps {
  indicator: Indicator;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

function ExportIndicatorRow({ indicator, isSelected, onToggle }: ExportIndicatorRowProps) {
  return (
    <label
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
        checked={isSelected}
        onChange={() => onToggle(indicator.id)}
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
  );
}
