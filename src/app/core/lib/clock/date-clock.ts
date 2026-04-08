import { InjectionToken } from '@angular/core';

/**
 * Injectable clock for “today” and `now()`.
 * Uses UTC calendar day (`toISOString().slice(0, 10)`) to match existing entry keys and stats.
 */
export interface DateClock {
  todayUtcIsoDate(): string;
  now(): Date;
}

export const DATE_CLOCK = new InjectionToken<DateClock>('DATE_CLOCK');

export function createSystemDateClock(): DateClock {
  return {
    todayUtcIsoDate: () => new Date().toISOString().slice(0, 10),
    now: () => new Date(),
  };
}

/** yyyy-MM-dd in the user’s local timezone (for UI that is explicitly local). */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
