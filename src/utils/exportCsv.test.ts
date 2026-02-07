import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportIndicatorsToCsv } from './exportCsv';
import type { Indicator } from '../types/indicator';

// Declare global for Node.js environment
declare const global: typeof globalThis;

describe('exportIndicatorsToCsv', () => {
  let mockLink: HTMLAnchorElement;
  let capturedCsvContent: string = '';

  beforeEach(() => {
    // Mock URL methods (not available in jsdom)
    // We need to capture the blob content synchronously
    vi.stubGlobal('Blob', class MockBlob {
      content: string;
      constructor(parts: BlobPart[]) {
        this.content = parts.join('');
        capturedCsvContent = this.content;
      }
      text() {
        return Promise.resolve(this.content);
      }
    });

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock link element
    mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'removeChild').mockReturnValue(mockLink);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    capturedCsvContent = '';
  });

  const createMockIndicator = (overrides: Partial<Indicator> = {}): Indicator => ({
    id: 'test-id-1',
    value: '192.168.1.1',
    type: 'ip',
    severity: 'high',
    source: 'TestSource',
    confidence: 85,
    firstSeen: '2025-01-01T00:00:00.000Z',
    lastSeen: '2025-01-15T12:00:00.000Z',
    tags: ['malware', 'botnet'],
    ...overrides,
  });

  it('does nothing when indicators array is empty', () => {
    exportIndicatorsToCsv([]);

    expect(document.createElement).not.toHaveBeenCalled();
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('creates a CSV with correct headers', () => {
    const indicator = createMockIndicator();
    exportIndicatorsToCsv([indicator]);

    const lines = capturedCsvContent.split('\n');

    expect(lines[0]).toBe('id,value,type,severity,source,confidence,firstSeen,lastSeen,tags');
  });

  it('includes indicator data in CSV', () => {
    const indicator = createMockIndicator();
    exportIndicatorsToCsv([indicator]);

    const lines = capturedCsvContent.split('\n');

    expect(lines[1]).toContain('test-id-1');
    expect(lines[1]).toContain('192.168.1.1');
    expect(lines[1]).toContain('ip');
    expect(lines[1]).toContain('high');
    expect(lines[1]).toContain('TestSource');
    expect(lines[1]).toContain('85');
  });

  it('joins tags with semicolon', () => {
    const indicator = createMockIndicator({
      tags: ['tag1', 'tag2', 'tag3'],
    });
    exportIndicatorsToCsv([indicator]);

    expect(capturedCsvContent).toContain('tag1;tag2;tag3');
  });

  it('escapes values containing commas', () => {
    const indicator = createMockIndicator({
      value: 'value,with,commas',
    });
    exportIndicatorsToCsv([indicator]);

    expect(capturedCsvContent).toContain('"value,with,commas"');
  });

  it('escapes values containing quotes', () => {
    const indicator = createMockIndicator({
      value: 'value"with"quotes',
    });
    exportIndicatorsToCsv([indicator]);

    expect(capturedCsvContent).toContain('"value""with""quotes"');
  });

  it('escapes values containing newlines', () => {
    const indicator = createMockIndicator({
      value: 'value\nwith\nnewlines',
    });
    exportIndicatorsToCsv([indicator]);

    expect(capturedCsvContent).toContain('"value\nwith\nnewlines"');
  });

  it('exports multiple indicators', () => {
    const indicators = [
      createMockIndicator({ id: 'id-1', value: '1.1.1.1' }),
      createMockIndicator({ id: 'id-2', value: '2.2.2.2' }),
      createMockIndicator({ id: 'id-3', value: '3.3.3.3' }),
    ];
    exportIndicatorsToCsv(indicators);

    const lines = capturedCsvContent.split('\n');

    // Header + 3 data rows
    expect(lines).toHaveLength(4);
    expect(lines[1]).toContain('id-1');
    expect(lines[2]).toContain('id-2');
    expect(lines[3]).toContain('id-3');
  });

  it('triggers download with timestamped filename', () => {
    const indicator = createMockIndicator();
    exportIndicatorsToCsv([indicator]);

    expect(mockLink.download).toMatch(/^indicators-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.csv$/);
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('cleans up after download', () => {
    const indicator = createMockIndicator();
    exportIndicatorsToCsv([indicator]);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles empty tags array', () => {
    const indicator = createMockIndicator({ tags: [] });
    exportIndicatorsToCsv([indicator]);

    const lines = capturedCsvContent.split('\n');

    // Last column should be empty (just the previous column value followed by nothing)
    expect(lines[1]!.endsWith(',') || lines[1]!.split(',').pop() === '').toBe(true);
  });

  it('handles all indicator types', () => {
    const indicators = [
      createMockIndicator({ type: 'ip', value: '1.2.3.4' }),
      createMockIndicator({ type: 'domain', value: 'example.com' }),
      createMockIndicator({ type: 'hash', value: 'abc123def456' }),
      createMockIndicator({ type: 'url', value: 'https://example.com/path' }),
    ];
    exportIndicatorsToCsv(indicators);

    expect(capturedCsvContent).toContain('ip');
    expect(capturedCsvContent).toContain('domain');
    expect(capturedCsvContent).toContain('hash');
    expect(capturedCsvContent).toContain('url');
  });

  it('handles all severity levels', () => {
    const indicators = [
      createMockIndicator({ severity: 'critical' }),
      createMockIndicator({ severity: 'high' }),
      createMockIndicator({ severity: 'medium' }),
      createMockIndicator({ severity: 'low' }),
    ];
    exportIndicatorsToCsv(indicators);

    expect(capturedCsvContent).toContain('critical');
    expect(capturedCsvContent).toContain('high');
    expect(capturedCsvContent).toContain('medium');
    expect(capturedCsvContent).toContain('low');
  });
});
