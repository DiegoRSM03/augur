import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, getTagColor, getTypeIcon, getTypeLabel } from './formatters';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Mock current time to 2026-02-07T12:00:00Z
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-07T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for times less than a minute ago', () => {
    const thirtySecondsAgo = new Date('2026-02-07T11:59:30Z').toISOString();
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');
  });

  it('returns minutes for times less than an hour ago', () => {
    const fiveMinutesAgo = new Date('2026-02-07T11:55:00Z').toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 min ago');

    const thirtyMinutesAgo = new Date('2026-02-07T11:30:00Z').toISOString();
    expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30 min ago');
  });

  it('returns hours for times less than a day ago', () => {
    const twoHoursAgo = new Date('2026-02-07T10:00:00Z').toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

    const twentyThreeHoursAgo = new Date('2026-02-06T13:00:00Z').toISOString();
    expect(formatRelativeTime(twentyThreeHoursAgo)).toBe('23h ago');
  });

  it('returns days for times less than a week ago', () => {
    const threeDaysAgo = new Date('2026-02-04T12:00:00Z').toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
  });

  it('returns weeks for times less than a month ago', () => {
    const twoWeeksAgo = new Date('2026-01-24T12:00:00Z').toISOString();
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2w ago');
  });

  it('returns months for older times', () => {
    const twoMonthsAgo = new Date('2025-12-07T12:00:00Z').toISOString();
    expect(formatRelativeTime(twoMonthsAgo)).toBe('2mo ago');
  });

  it('returns "Unknown" for invalid dates', () => {
    expect(formatRelativeTime('invalid-date')).toBe('Unknown');
  });
});

describe('getTagColor', () => {
  it('returns red for high-severity threat tags', () => {
    expect(getTagColor('tor-exit')).toBe('red');
    expect(getTagColor('botnet')).toBe('red');
    expect(getTagColor('malware')).toBe('red');
    expect(getTagColor('ransomware')).toBe('red');
  });

  it('returns purple for C2 and infrastructure tags', () => {
    expect(getTagColor('c2')).toBe('purple');
    expect(getTagColor('dropper')).toBe('purple');
    expect(getTagColor('loader')).toBe('purple');
  });

  it('returns teal for phishing and social engineering tags', () => {
    expect(getTagColor('phishing')).toBe('teal');
    expect(getTagColor('credential')).toBe('teal');
    expect(getTagColor('brute-force')).toBe('teal');
  });

  it('returns blue for scanning and recon tags', () => {
    expect(getTagColor('scanner')).toBe('blue');
    expect(getTagColor('recon')).toBe('blue');
  });

  it('returns gray for unknown tags', () => {
    expect(getTagColor('unknown')).toBe('gray');
    expect(getTagColor('other')).toBe('gray');
    expect(getTagColor('sinkhole')).toBe('gray');
  });

  it('is case-insensitive', () => {
    expect(getTagColor('TOR-EXIT')).toBe('red');
    expect(getTagColor('Phishing')).toBe('teal');
    expect(getTagColor('SCANNER')).toBe('blue');
  });
});

describe('getTypeIcon', () => {
  it('returns correct icon for each type', () => {
    expect(getTypeIcon('ip')).toBe('⬡');
    expect(getTypeIcon('domain')).toBe('◎');
    expect(getTypeIcon('hash')).toBe('#');
    expect(getTypeIcon('url')).toBe('🔗');
  });
});

describe('getTypeLabel', () => {
  it('returns correct label for each type', () => {
    expect(getTypeLabel('ip')).toBe('IP');
    expect(getTypeLabel('domain')).toBe('Domain');
    expect(getTypeLabel('hash')).toBe('Hash');
    expect(getTypeLabel('url')).toBe('URL');
  });
});
