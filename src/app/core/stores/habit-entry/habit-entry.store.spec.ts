import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DATE_CLOCK } from '../../lib/clock/date-clock';
import { Habit, HabitEntry, HabitEntryInput } from '../../models';
import { HabitEntryService } from '../../services';
import { mockHabitEntries } from '../../services/habit-entry/mock-habit-entries';
import { HabitEntryStore } from './habit-entry.store';

describe('HabitEntryStore', () => {
  let service: HabitEntryStore;
  let habitEntryServiceMock: HabitEntryService;
  const habit: Habit = {
    id: 'habit-1',
    name: 'Test Habit',
    icon: 'self_improvement',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const clock = {
    todayUtcIsoDate: () => '2025-08-25',
    now: () => new Date('2025-08-25T12:00:00.000Z'),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-25T12:00:00.000Z'));

    habitEntryServiceMock = {
      getEntriesForHabit: vi
        .fn()
        .mockReturnValue([
          ...mockHabitEntries.filter((entry) => entry.habitId === 'habit-1'),
        ]),
      addEntry: vi.fn().mockImplementation((entry: HabitEntryInput) => {
        const newEntry: HabitEntry = {
          ...entry,
          id: 'new-id',
          date: clock.todayUtcIsoDate(),
        };

        return newEntry;
      }),
      updateEntry: vi.fn(),
      removeEntry: vi.fn(),
      switchStatus: vi.fn(),
      getEntryById: vi.fn(),
    } as unknown as HabitEntryService;

    TestBed.configureTestingModule({
      providers: [
        HabitEntryStore,
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
        { provide: DATE_CLOCK, useValue: clock },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(HabitEntryStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should add a habit entry for today if not exists', () => {
    service.setHabit(habit);

    expect(habitEntryServiceMock.addEntry).toHaveBeenCalledWith({
      habitId: habit.id,
      status: 'pending',
    } as HabitEntryInput);
  });

  it('should fetch the entries when setting the habit', () => {
    service.setHabit(habit);
    const mockEntries = mockHabitEntries.filter(
      (entry) => entry.habitId === 'habit-1',
    );

    expect(habitEntryServiceMock.getEntriesForHabit).toHaveBeenCalledWith(
      habit.id,
    );
    const entriesWithoutToday = service.habitEntries().slice(0, 9);
    expect(entriesWithoutToday).toEqual(mockEntries);
  });

  it('should switch status and refresh the entries', () => {
    service.setHabit(habit);
    const todayEntry = service.todayEntry();

    service.switchTodayStatus();

    expect(todayEntry).toBeDefined();
    expect(habitEntryServiceMock.switchStatus).toHaveBeenCalledWith(
      todayEntry!.id,
    );
    expect(habitEntryServiceMock.getEntriesForHabit).toHaveBeenCalledWith(
      habit.id,
    );
  });
});
