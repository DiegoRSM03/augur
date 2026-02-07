import { describe, it, expect } from 'vitest';
import { detectIndicatorType, getIndicatorTypeLabel } from './detectIndicatorType';

describe('detectIndicatorType', () => {
  describe('IP addresses', () => {
    it('detects valid IPv4 addresses', () => {
      expect(detectIndicatorType('192.168.1.1')).toBe('ip');
      expect(detectIndicatorType('10.0.0.1')).toBe('ip');
      expect(detectIndicatorType('185.220.101.34')).toBe('ip');
      expect(detectIndicatorType('0.0.0.0')).toBe('ip');
      expect(detectIndicatorType('255.255.255.255')).toBe('ip');
    });

    it('rejects invalid IP addresses', () => {
      expect(detectIndicatorType('256.1.1.1')).toBeNull(); // octet > 255
      expect(detectIndicatorType('192.168.1')).toBeNull(); // missing octet
      expect(detectIndicatorType('192.168.1.1.1')).toBeNull(); // extra octet
      expect(detectIndicatorType('192.168.1.a')).toBeNull(); // non-numeric
    });
  });

  describe('domains', () => {
    it('detects valid domain names', () => {
      expect(detectIndicatorType('example.com')).toBe('domain');
      expect(detectIndicatorType('malware-c2.storm-412.ru')).toBe('domain');
      expect(detectIndicatorType('sub.domain.example.org')).toBe('domain');
      expect(detectIndicatorType('cdn-fake.zero-88.tk')).toBe('domain');
    });

    it('rejects invalid domain names', () => {
      expect(detectIndicatorType('example')).toBeNull(); // no TLD
      expect(detectIndicatorType('-example.com')).toBeNull(); // starts with hyphen
    });
  });

  describe('hashes', () => {
    it('detects MD5 hashes (32 hex chars)', () => {
      expect(detectIndicatorType('d41d8cd98f00b204e9800998ecf8427e')).toBe('hash');
      expect(detectIndicatorType('D41D8CD98F00B204E9800998ECF8427E')).toBe('hash');
    });

    it('detects SHA-256 hashes (64 hex chars)', () => {
      expect(
        detectIndicatorType('a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1')
      ).toBe('hash');
      expect(
        detectIndicatorType('A3F8B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1')
      ).toBe('hash');
    });

    it('rejects invalid hashes', () => {
      expect(detectIndicatorType('d41d8cd98f00b204e9800998ecf8427')).toBeNull(); // 31 chars
      expect(detectIndicatorType('d41d8cd98f00b204e9800998ecf8427eg')).toBeNull(); // invalid char
    });
  });

  describe('URLs', () => {
    it('detects HTTP URLs', () => {
      expect(detectIndicatorType('http://example.com')).toBe('url');
      expect(detectIndicatorType('http://example.com/path?query=1')).toBe('url');
    });

    it('detects HTTPS URLs', () => {
      expect(detectIndicatorType('https://example.com')).toBe('url');
      expect(detectIndicatorType('https://phish-login.ghost-223.xyz/login?id=48271')).toBe('url');
    });

    it('rejects invalid URLs', () => {
      expect(detectIndicatorType('ftp://example.com')).toBeNull(); // wrong protocol
    });

    it('detects domain for URL-like strings without protocol', () => {
      expect(detectIndicatorType('example.com/path')).toBeNull(); // has path but no protocol
    });
  });

  describe('edge cases', () => {
    it('returns null for empty strings', () => {
      expect(detectIndicatorType('')).toBeNull();
      expect(detectIndicatorType('   ')).toBeNull();
    });

    it('trims whitespace before detection', () => {
      expect(detectIndicatorType('  192.168.1.1  ')).toBe('ip');
      expect(detectIndicatorType('\nexample.com\n')).toBe('domain');
    });

    it('returns null for unrecognized patterns', () => {
      expect(detectIndicatorType('random text')).toBeNull();
      expect(detectIndicatorType('12345')).toBeNull();
    });
  });
});

describe('getIndicatorTypeLabel', () => {
  it('returns correct labels for each type', () => {
    expect(getIndicatorTypeLabel('ip')).toBe('IP Address');
    expect(getIndicatorTypeLabel('domain')).toBe('Domain');
    expect(getIndicatorTypeLabel('hash')).toBe('File Hash');
    expect(getIndicatorTypeLabel('url')).toBe('URL');
  });
});
