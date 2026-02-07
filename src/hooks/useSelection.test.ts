import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from './useSelection';
import type { Indicator } from '../types/indicator';

// Helper to create mock indicators
const createMockIndicator = (id: string, overrides: Partial<Indicator> = {}): Indicator => ({
  id,
  value: `value-${id}`,
  type: 'ip',
  severity: 'high',
  source: 'TestSource',
  confidence: 85,
  firstSeen: '2025-01-01T00:00:00.000Z',
  lastSeen: '2025-01-15T12:00:00.000Z',
  tags: ['test'],
  ...overrides,
});

describe('useSelection', () => {
  it('initializes with empty selection', () => {
    const { result } = renderHook(() => useSelection());

    expect(result.current.selectedCount).toBe(0);
    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.selectedArray).toEqual([]);
  });

  describe('toggleSelection', () => {
    it('adds an indicator to selection', () => {
      const { result } = renderHook(() => useSelection());
      const indicator = createMockIndicator('id-1');

      act(() => {
        result.current.toggleSelection(indicator);
      });

      expect(result.current.selectedCount).toBe(1);
      expect(result.current.isSelected('id-1')).toBe(true);
      expect(result.current.selectedArray[0]).toEqual(indicator);
    });

    it('removes an indicator from selection when toggled again', () => {
      const { result } = renderHook(() => useSelection());
      const indicator = createMockIndicator('id-1');

      act(() => {
        result.current.toggleSelection(indicator);
      });

      expect(result.current.isSelected('id-1')).toBe(true);

      act(() => {
        result.current.toggleSelection(indicator);
      });

      expect(result.current.isSelected('id-1')).toBe(false);
      expect(result.current.selectedCount).toBe(0);
    });

    it('can select multiple indicators', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        indicators.forEach((i) => result.current.toggleSelection(i));
      });

      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected('id-1')).toBe(true);
      expect(result.current.isSelected('id-2')).toBe(true);
      expect(result.current.isSelected('id-3')).toBe(true);
    });
  });

  describe('selectAll', () => {
    it('selects all provided indicators', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        result.current.selectAll(indicators);
      });

      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected('id-1')).toBe(true);
      expect(result.current.isSelected('id-2')).toBe(true);
      expect(result.current.isSelected('id-3')).toBe(true);
    });

    it('adds to existing selection', () => {
      const { result } = renderHook(() => useSelection());

      act(() => {
        result.current.toggleSelection(createMockIndicator('id-0'));
      });

      act(() => {
        result.current.selectAll([
          createMockIndicator('id-1'),
          createMockIndicator('id-2'),
        ]);
      });

      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected('id-0')).toBe(true);
      expect(result.current.isSelected('id-1')).toBe(true);
      expect(result.current.isSelected('id-2')).toBe(true);
    });
  });

  describe('deselectAll', () => {
    it('removes all provided IDs from selection', () => {
      const { result } = renderHook(() => useSelection());

      act(() => {
        result.current.selectAll([
          createMockIndicator('id-1'),
          createMockIndicator('id-2'),
          createMockIndicator('id-3'),
        ]);
      });

      act(() => {
        result.current.deselectAll(['id-1', 'id-2']);
      });

      expect(result.current.selectedCount).toBe(1);
      expect(result.current.isSelected('id-1')).toBe(false);
      expect(result.current.isSelected('id-2')).toBe(false);
      expect(result.current.isSelected('id-3')).toBe(true);
    });
  });

  describe('clearSelection', () => {
    it('clears all selections', () => {
      const { result } = renderHook(() => useSelection());

      act(() => {
        result.current.selectAll([
          createMockIndicator('id-1'),
          createMockIndicator('id-2'),
          createMockIndicator('id-3'),
        ]);
      });

      expect(result.current.selectedCount).toBe(3);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.selectedIds.size).toBe(0);
    });
  });

  describe('getPageSelectionState', () => {
    it('returns allSelected: false when no items selected', () => {
      const { result } = renderHook(() => useSelection());

      const state = result.current.getPageSelectionState(['id-1', 'id-2']);

      expect(state.allSelected).toBe(false);
      expect(state.someSelected).toBe(false);
      expect(state.selectedOnPageCount).toBe(0);
    });

    it('returns someSelected: true when some items selected', () => {
      const { result } = renderHook(() => useSelection());

      act(() => {
        result.current.toggleSelection(createMockIndicator('id-1'));
      });

      const state = result.current.getPageSelectionState(['id-1', 'id-2', 'id-3']);

      expect(state.allSelected).toBe(false);
      expect(state.someSelected).toBe(true);
      expect(state.selectedOnPageCount).toBe(1);
    });

    it('returns allSelected: true when all items selected', () => {
      const { result } = renderHook(() => useSelection());

      act(() => {
        result.current.selectAll([
          createMockIndicator('id-1'),
          createMockIndicator('id-2'),
          createMockIndicator('id-3'),
        ]);
      });

      const state = result.current.getPageSelectionState(['id-1', 'id-2', 'id-3']);

      expect(state.allSelected).toBe(true);
      expect(state.someSelected).toBe(false);
      expect(state.selectedOnPageCount).toBe(3);
    });

    it('handles empty page', () => {
      const { result } = renderHook(() => useSelection());

      const state = result.current.getPageSelectionState([]);

      expect(state.allSelected).toBe(false);
      expect(state.someSelected).toBe(false);
      expect(state.selectedOnPageCount).toBe(0);
    });
  });

  describe('toggleAllOnPage', () => {
    it('selects all when none selected', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        result.current.toggleAllOnPage(indicators);
      });

      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected('id-1')).toBe(true);
      expect(result.current.isSelected('id-2')).toBe(true);
      expect(result.current.isSelected('id-3')).toBe(true);
    });

    it('selects all when some selected', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        result.current.toggleSelection(indicators[0]!);
      });

      act(() => {
        result.current.toggleAllOnPage(indicators);
      });

      expect(result.current.selectedCount).toBe(3);
    });

    it('deselects all when all selected', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        result.current.selectAll(indicators);
      });

      act(() => {
        result.current.toggleAllOnPage(indicators);
      });

      expect(result.current.selectedCount).toBe(0);
    });

    it('preserves selections from other pages', () => {
      const { result } = renderHook(() => useSelection());

      // Select items from "page 1"
      const page1Indicators = [
        createMockIndicator('page1-id-1'),
        createMockIndicator('page1-id-2'),
      ];
      act(() => {
        result.current.selectAll(page1Indicators);
      });

      // Toggle all on "page 2"
      const page2Indicators = [
        createMockIndicator('page2-id-1'),
        createMockIndicator('page2-id-2'),
      ];
      act(() => {
        result.current.toggleAllOnPage(page2Indicators);
      });

      // Page 1 selections should persist
      expect(result.current.isSelected('page1-id-1')).toBe(true);
      expect(result.current.isSelected('page1-id-2')).toBe(true);
      // Page 2 should be selected
      expect(result.current.isSelected('page2-id-1')).toBe(true);
      expect(result.current.isSelected('page2-id-2')).toBe(true);
      expect(result.current.selectedCount).toBe(4);
    });
  });

  describe('selectedArray', () => {
    it('returns array of selected indicators', () => {
      const { result } = renderHook(() => useSelection());
      const indicators = [
        createMockIndicator('id-1'),
        createMockIndicator('id-2'),
        createMockIndicator('id-3'),
      ];

      act(() => {
        result.current.selectAll(indicators);
      });

      expect(result.current.selectedArray).toHaveLength(3);
      // Check that the full indicator objects are stored
      expect(result.current.selectedArray.find((i) => i.id === 'id-1')).toBeDefined();
      expect(result.current.selectedArray.find((i) => i.id === 'id-2')).toBeDefined();
      expect(result.current.selectedArray.find((i) => i.id === 'id-3')).toBeDefined();
    });

    it('stores full indicator data for export', () => {
      const { result } = renderHook(() => useSelection());
      const indicator = createMockIndicator('id-1', {
        value: '192.168.1.1',
        type: 'ip',
        severity: 'critical',
        source: 'AbuseIPDB',
        tags: ['tor-exit', 'botnet'],
      });

      act(() => {
        result.current.toggleSelection(indicator);
      });

      const stored = result.current.selectedArray[0]!;
      expect(stored.id).toBe('id-1');
      expect(stored.value).toBe('192.168.1.1');
      expect(stored.type).toBe('ip');
      expect(stored.severity).toBe('critical');
      expect(stored.source).toBe('AbuseIPDB');
      expect(stored.tags).toEqual(['tor-exit', 'botnet']);
    });
  });
});
