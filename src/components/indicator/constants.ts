import type { IndicatorType, Severity } from '../../types/indicator';

export const PREDEFINED_SOURCES = [
  'AbuseIPDB',
  'VirusTotal',
  'OTX AlienVault',
  'Emerging Threats',
  'MalwareBazaar',
  'PhishTank',
  'Spamhaus',
  'ThreatFox',
  'URLhaus',
  'CIRCL',
  'Shodan',
  'GreyNoise',
  'BinaryEdge',
  'Censys',
  'Silent Push',
  'DomainTools',
  'Manual Entry',
];

export const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const TYPE_OPTIONS = [
  { value: 'ip', label: 'IP Address' },
  { value: 'domain', label: 'Domain' },
  { value: 'hash', label: 'File Hash' },
  { value: 'url', label: 'URL' },
];

export interface FormState {
  value: string;
  type: IndicatorType | '';
  severity: Severity | '';
  confidence: number;
  source: string;
  tags: string[];
  lastSeen: string;
  firstSeen: string;
  provider: string;
  reports: number;
  relatedCampaigns: string;
}

export interface FormErrors {
  value?: string;
  type?: string;
  severity?: string;
  source?: string;
  tags?: string;
  lastSeen?: string;
}
