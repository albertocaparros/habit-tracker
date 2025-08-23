import { describe, expect, it } from 'vitest';
import { FormatDatePipe } from './format-date-pipe';

describe('FormatDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should format date correctly', () => {
    const pipe = new FormatDatePipe();
    const date = new Date('2023-10-01T00:00:00Z');
    expect(pipe.transform(date)).toBe('01/10/2023');
  });

  it('should format date string correctly', () => {
    const pipe = new FormatDatePipe();
    const dateString = '2023-10-01T00:00:00Z';
    expect(pipe.transform(dateString)).toBe('01/10/2023');
  });

  it('should return "Invalid date" for invalid date input', () => {
    const pipe = new FormatDatePipe();
    expect(pipe.transform('invalid date')).toBe('Invalid date');
  });

  it('should handle empty input', () => {
    const pipe = new FormatDatePipe();
    expect(pipe.transform('')).toBe('Invalid date');
  });
});
