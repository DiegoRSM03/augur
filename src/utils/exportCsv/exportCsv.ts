import type { Indicator } from '../../types/indicator';

function escapeCSVValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function generateFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `indicators-export-${timestamp}.csv`;
}

const CSV_HEADERS = [
  'id',
  'value',
  'type',
  'severity',
  'source',
  'confidence',
  'firstSeen',
  'lastSeen',
  'tags',
];

function indicatorToCSVRow(indicator: Indicator): string {
  const values = [
    indicator.id,
    indicator.value,
    indicator.type,
    indicator.severity,
    indicator.source,
    indicator.confidence,
    indicator.firstSeen,
    indicator.lastSeen,
    indicator.tags.join(';'), // semicolons avoid CSV comma conflicts
  ];

  return values.map(escapeCSVValue).join(',');
}

export function exportIndicatorsToCsv(indicators: Indicator[]): void {
  if (indicators.length === 0) {
    return;
  }

  const headerRow = CSV_HEADERS.join(',');
  const dataRows = indicators.map(indicatorToCSVRow);
  const csvContent = [headerRow, ...dataRows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const filename = generateFilename();

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
