/**
 * Known threat intelligence sources
 */
export const KNOWN_SOURCES = [
  'AbuseIPDB',
  'VirusTotal',
  'OTX AlienVault',
  'Emerging Threats',
  'Silent Push',
  'MalwareBazaar',
  'PhishTank',
  'GreyNoise',
  'URLhaus',
] as const;

export type KnownSource = (typeof KNOWN_SOURCES)[number];
