import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DailyStats, HabitStats } from '../../models';
import { HabitService } from '../habit/habit.service';
import { mockHabits } from '../habit/mock-habits';
import { HabitEntryService } from '../habit-entry/habit-entry.service';
import { mockHabitEntries } from '../habit-entry/mock-habit-entries';
import { StatsService } from './stats.service';

describe('Stats', () => {
  let service: StatsService;
  const habitServiceMock: HabitService = {
    getHabits: vi.fn().mockReturnValue(signal(mockHabits)),
    addHabit: vi.fn(),
    updateHabit: vi.fn(),
    removeHabit: vi.fn(),
  } as unknown as HabitService;

  const habit1Entries = mockHabitEntries.filter((e) => e.habitId === 'habit-1');
  const habit2Entries = mockHabitEntries.filter((e) => e.habitId === 'habit-2');

  const habitEntryServiceMock: HabitEntryService = {
    getEntriesForHabit: vi.fn().mockImplementation((id) => {
      if (id === 'habit-1') return habit1Entries;
      if (id === 'habit-2') return habit2Entries;
      return [];
    }),
    addEntry: vi.fn(),
    updateEntry: vi.fn(),
    removeEntry: vi.fn(),
  } as unknown as HabitEntryService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-25'));

    TestBed.configureTestingModule({
      providers: [
        StatsService,
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
        { provide: HabitService, useValue: habitServiceMock },
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(StatsService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the expected daily stats', () => {
    const expectedDailyData: { [key: string]: DailyStats } = {
      '2025-08-01': {
        completed: 0,
        total: 1,
      },
      '2025-08-02': {
        completed: 0,
        total: 1,
      },
      '2025-08-03': {
        completed: 0,
        total: 1,
      },
      '2025-08-04': {
        completed: 0,
        total: 1,
      },
      '2025-08-05': {
        completed: 0,
        total: 2,
      },
      '2025-08-06': {
        completed: 0,
        total: 2,
      },
      '2025-08-07': {
        completed: 0,
        total: 2,
      },
      '2025-08-08': {
        completed: 0,
        total: 2,
      },
      '2025-08-09': {
        completed: 0,
        total: 2,
      },
      '2025-08-10': {
        completed: 1,
        total: 2,
      },
      '2025-08-11': {
        completed: 1,
        total: 2,
      },
      '2025-08-12': {
        completed: 1,
        total: 2,
      },
      '2025-08-13': {
        completed: 1,
        total: 2,
      },
      '2025-08-14': {
        completed: 2,
        total: 2,
      },
      '2025-08-15': {
        completed: 1,
        total: 2,
      },
      '2025-08-16': {
        completed: 2,
        total: 2,
      },
      '2025-08-17': {
        completed: 1,
        total: 2,
      },
      '2025-08-18': {
        completed: 1,
        total: 2,
      },
      '2025-08-19': {
        completed: 0,
        total: 2,
      },
      '2025-08-20': {
        completed: 0,
        total: 2,
      },
      '2025-08-21': {
        completed: 0,
        total: 2,
      },
      '2025-08-22': {
        completed: 0,
        total: 2,
      },
      '2025-08-23': {
        completed: 0,
        total: 2,
      },
      '2025-08-24': {
        completed: 0,
        total: 2,
      },
      '2025-08-25': {
        completed: 0,
        total: 2,
      },
    };

    const dailyData = service.getDailyStatsData();

    expect(dailyData).toEqual(expectedDailyData);
  });

  it('should return the expected habit stats', () => {
    const expectedHabitStats: HabitStats = {
      longestStreak: { days: 8, habitName: 'Daily Meditation' },
      mostClearedHabit: {
        habitName: 'Daily Meditation',
        clearingPercentage: (8 / 9) * 100,
      },
      leastClearedHabit: {
        habitName: 'Drink Water',
        clearingPercentage: 60,
      },
      completionRate: (22 / 28) * 100,
    };

    const habitStats = service.getHabitStats();

    expect(habitStats).toEqual(expectedHabitStats);
  });
});
