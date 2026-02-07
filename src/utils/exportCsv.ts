import type { Indicator } from '../types/indicator';

/**
 * Escape a value for CSV format
 * 
 * - Wraps value in quotes if it contains commas, quotes, or newlines
 * - Escapes double quotes by doubling them
 */
function escapeCSVValue(value: string | number): string {
  const stringValue = String(value);
  
  // Check if value needs escaping
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Escape double quotes by doubling them, then wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Generate a timestamped filename for the export
 */
function generateFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `indicators-export-${timestamp}.csv`;
}

/**
 * CSV column headers
 */
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

/**
 * Convert an indicator to a CSV row
 */
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
    indicator.tags.join(';'), // Join tags with semicolon to avoid CSV comma conflicts
  ];

  return values.map(escapeCSVValue).join(',');
}

/**
 * Export indicators to CSV and trigger browser download
 * 
 * @param indicators - Array of indicators to export
 */
export function exportIndicatorsToCsv(indicators: Indicator[]): void {
  if (indicators.length === 0) {
    return;
  }

  // Build CSV content
  const headerRow = CSV_HEADERS.join(',');
  const dataRows = indicators.map(indicatorToCSVRow);
  const csvContent = [headerRow, ...dataRows].join('\n');

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const filename = generateFilename();

  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
