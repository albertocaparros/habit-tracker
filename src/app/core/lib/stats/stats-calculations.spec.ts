import { describe, expect, it } from 'vitest';
import type { Habit, HabitEntry } from '../../models';
import {
  buildDailyStatsData,
  buildHabitStats,
  longestDoneStreakDays,
} from './stats-calculations';

describe('stats-calculations', () => {
  it('computes longest streak of consecutive done days', () => {
    const entries: HabitEntry[] = [
      { id: '1', habitId: 'h', date: '2025-08-10', status: 'done' },
      { id: '2', habitId: 'h', date: '2025-08-11', status: 'done' },
      { id: '3', habitId: 'h', date: '2025-08-13', status: 'done' },
    ];
    expect(longestDoneStreakDays(entries)).toBe(2);
  });

  it('buildHabitStats aggregates clearing and completion rate', () => {
    const habits: Habit[] = [
      {
        id: 'a',
        name: 'A',
        icon: 'x',
        createdAt: '2025-08-01',
      },
    ];
    const entries: HabitEntry[] = [
      { id: '1', habitId: 'a', date: '2025-08-10', status: 'done' },
      { id: '2', habitId: 'a', date: '2025-08-11', status: 'missed' },
    ];
    const stats = buildHabitStats(habits, () => entries);
    expect(stats.completionRate).toBe(50);
    expect(stats.mostClearedHabit.habitName).toBe('A');
  });

  it('buildDailyStatsData includes each day from earliest habit through end date', () => {
    const habits: Habit[] = [
      {
        id: 'a',
        name: 'A',
        icon: 'x',
        createdAt: '2025-08-02',
      },
    ];
    const entry: HabitEntry = {
      id: '1',
      habitId: 'a',
      date: '2025-08-02',
      status: 'done',
    };
    const end = new Date('2025-08-04T12:00:00');
    const map = buildDailyStatsData(habits, () => [entry], end);
    expect(Object.keys(map).length).toBeGreaterThanOrEqual(3);
    expect(map['2025-08-02']?.completed).toBe(1);
  });
});
