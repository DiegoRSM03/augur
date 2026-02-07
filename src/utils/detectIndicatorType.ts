/**
 * Indicator Type Auto-Detection
 *
 * Detects the type of a threat indicator based on its value pattern.
 * Supports IP addresses, domains, file hashes (MD5/SHA-256), and URLs.
 */

import type { IndicatorType } from '../types/indicator';

// IP address pattern: 4 octets separated by dots (0-255 each)
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;

// Domain pattern: valid hostname with at least one dot and TLD
// Allows subdomains and hyphens in the middle of labels
const DOMAIN_PATTERN = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Hash patterns: MD5 (32 hex chars) or SHA-256 (64 hex chars)
const MD5_PATTERN = /^[a-fA-F0-9]{32}$/;
const SHA256_PATTERN = /^[a-fA-F0-9]{64}$/;

// URL pattern: starts with http:// or https://
const URL_PATTERN = /^https?:\/\/.+/;

/**
 * Validates if an IP address has valid octets (0-255)
 */
function isValidIpAddress(value: string): boolean {
  if (!IP_PATTERN.test(value)) return false;

  const octets = value.split('.').map(Number);
  return octets.every((octet) => octet >= 0 && octet <= 255);
}

/**
 * Detects the indicator type from a given value.
 *
 * @param value - The indicator value to analyze
 * @returns The detected IndicatorType or null if no pattern matches
 *
 * Detection order matters:
 * 1. URL (most specific - has protocol prefix)
 * 2. IP (specific numeric pattern)
 * 3. Hash (specific length hex strings)
 * 4. Domain (fallback for hostname-like strings)
 */
export function detectIndicatorType(value: string): IndicatorType | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  // Check URL first (most specific due to protocol)
  if (URL_PATTERN.test(trimmed)) {
    return 'url';
  }

  // Check IP address
  if (isValidIpAddress(trimmed)) {
    return 'ip';
  }

  // Check hash patterns (SHA-256 first as it's more specific)
  if (SHA256_PATTERN.test(trimmed) || MD5_PATTERN.test(trimmed)) {
    return 'hash';
  }

  // Check domain pattern
  if (DOMAIN_PATTERN.test(trimmed)) {
    return 'domain';
  }

  return null;
}

/**
 * Returns a human-readable label for an indicator type
 */
export function getIndicatorTypeLabel(type: IndicatorType): string {
  const labels: Record<IndicatorType, string> = {
    ip: 'IP Address',
    domain: 'Domain',
    hash: 'File Hash',
    url: 'URL',
  };
  return labels[type];
}
