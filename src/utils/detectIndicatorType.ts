import type { IndicatorType } from '../types/indicator';

const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;
const DOMAIN_PATTERN = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const MD5_PATTERN = /^[a-fA-F0-9]{32}$/;
const SHA256_PATTERN = /^[a-fA-F0-9]{64}$/;
const URL_PATTERN = /^https?:\/\/.+/;

function isValidIpAddress(value: string): boolean {
  if (!IP_PATTERN.test(value)) return false;

  const octets = value.split('.').map(Number);
  return octets.every((octet) => octet >= 0 && octet <= 255);
}

// Detection order: URL → IP → Hash → Domain (most specific first)
export function detectIndicatorType(value: string): IndicatorType | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  if (URL_PATTERN.test(trimmed)) {
    return 'url';
  }

  if (isValidIpAddress(trimmed)) {
    return 'ip';
  }

  if (SHA256_PATTERN.test(trimmed) || MD5_PATTERN.test(trimmed)) {
    return 'hash';
  }

  if (DOMAIN_PATTERN.test(trimmed)) {
    return 'domain';
  }

  return null;
}

export function getIndicatorTypeLabel(type: IndicatorType): string {
  const labels: Record<IndicatorType, string> = {
    ip: 'IP Address',
    domain: 'Domain',
    hash: 'File Hash',
    url: 'URL',
  };
  return labels[type];
}
