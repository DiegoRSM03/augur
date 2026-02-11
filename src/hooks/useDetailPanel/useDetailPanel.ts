import { useState, useCallback, useEffect } from 'react';

interface UseDetailPanelOptions {
  escapeDisabled?: boolean;
}

interface UseDetailPanelReturn {
  activeRowId: string | null;
  isOpen: boolean;
  open: (id: string) => void;
  close: () => void;
}

export function useDetailPanel(options: UseDetailPanelOptions = {}): UseDetailPanelReturn {
  const { escapeDisabled = false } = options;

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const isOpen = activeRowId !== null;

  const open = useCallback((id: string) => {
    setActiveRowId(id);
  }, []);

  const close = useCallback(() => {
    setActiveRowId(null);
  }, []);

  useEffect(() => {
    if (!isOpen || escapeDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, escapeDisabled, close]);

  return { activeRowId, isOpen, open, close };
}
