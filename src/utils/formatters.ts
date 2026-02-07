/**
 * Utility functions for formatting data in the dashboard
 */

import type { IndicatorType } from '../types/indicator';

export type TagColor = 'red' | 'blue' | 'purple' | 'teal' | 'gray';

/**
 * Format an ISO date string to a relative time string
 * e.g., "2 min ago", "1h ago", "3d ago"
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Handle invalid dates
  if (isNaN(diffMs)) {
    return 'Unknown';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  }

  return `${diffMonths}mo ago`;
}

/**
 * Map tag names to colors based on common threat intelligence categories
 */
export function getTagColor(tag: string): TagColor {
  const normalizedTag = tag.toLowerCase();

  // Red tags - high severity threats
  const redTags = [
    'tor-exit',
    'botnet',
    'malware',
    'ransomware',
    'apt',
    'exploit',
    'backdoor',
    'trojan',
  ];
  if (redTags.some((t) => normalizedTag.includes(t))) {
    return 'red';
  }

  // Purple tags - C2 and infrastructure
  const purpleTags = ['c2', 'dropper', 'loader', 'command-control', 'infrastructure'];
  if (purpleTags.some((t) => normalizedTag.includes(t))) {
    return 'purple';
  }

  // Teal tags - phishing and social engineering
  const tealTags = ['phishing', 'spear-phishing', 'social', 'credential', 'brute-force'];
  if (tealTags.some((t) => normalizedTag.includes(t))) {
    return 'teal';
  }

  // Blue tags - scanning and reconnaissance
  const blueTags = ['scanner', 'recon', 'probe', 'enumeration', 'fingerprint'];
  if (blueTags.some((t) => normalizedTag.includes(t))) {
    return 'blue';
  }

  // Default to gray for unknown/informational tags
  return 'gray';
}

/**
 * Get the icon character for an indicator type
 */
export function getTypeIcon(type: IndicatorType): string {
  const icons: Record<IndicatorType, string> = {
    ip: '⬡',
    domain: '◎',
    hash: '#',
    url: '🔗',
  };

  return icons[type] ?? '•';
}

/**
 * Get the display label for an indicator type
 */
export function getTypeLabel(type: IndicatorType): string {
  const labels: Record<IndicatorType, string> = {
    ip: 'IP',
    domain: 'Domain',
    hash: 'Hash',
    url: 'URL',
  };

  return labels[type] ?? type.toUpperCase();
}
