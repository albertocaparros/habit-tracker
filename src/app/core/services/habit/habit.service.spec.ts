import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Habit, HabitInput } from '../../models';
import { HabitEntryService } from '../habit-entry/habit-entry.service';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;
  let habitEntryServiceMock: HabitEntryService = {
    getEntriesForHabit: vi.fn().mockReturnValue([]),
    addEntry: vi.fn(),
    updateEntry: vi.fn(),
    removeEntry: vi.fn(),
  } as unknown as HabitEntryService;

  const mockHabit: HabitInput = {
    name: 'Meditate',
    description: 'Daily meditation for mindfulness',
  };

  beforeEach(() => {
    habitEntryServiceMock = {
      getEntriesForHabit: vi.fn().mockReturnValue([]),
      addEntry: vi.fn(),
      updateEntry: vi.fn(),
      removeEntry: vi.fn(),
    } as unknown as HabitEntryService;

    TestBed.configureTestingModule({
      providers: [
        HabitService,
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(HabitService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should add a habit', () => {
    const insertedHabit: Habit = service.addHabit(mockHabit);

    expect(service.getHabits()()).toContain(insertedHabit);
  });

  it('should get all habits', () => {
    const mockHabit2 = {
      name: 'Exercise',
      description: 'Daily workout routine',
    };

    const insertedHabit1 = service.addHabit(mockHabit);
    const insertedHabit2 = service.addHabit(mockHabit2);

    const allHabits = service.getHabits()();
    expect(allHabits).toContain(insertedHabit1);
    expect(allHabits).toContain(insertedHabit2);
  });

  it('should get a habit by ID', () => {
    const insertedHabit = service.addHabit(mockHabit);
    const foundHabit = service.getHabitById(insertedHabit.id);

    expect(foundHabit).toEqual(insertedHabit);
  });

  it('should return undefined for non-existing habit ID', () => {
    const foundHabit = service.getHabitById('non-existing-id');
    expect(foundHabit).toBeUndefined();
  });

  it('should remove a habit', () => {
    const insertedHabit = service.addHabit(mockHabit);
    service.removeHabit(insertedHabit.id);

    expect(service.getHabits()).not.toContain(insertedHabit);
  });

  it('should update a habit', () => {
    const insertedHabit = service.addHabit(mockHabit);
    const updatedHabit: HabitInput = {
      name: 'Meditate Updated',
      description: 'Updated meditation description',
    };

    service.updateHabit(updatedHabit, insertedHabit.id);

    const foundHabit = service.getHabitById(insertedHabit.id);
    expect(foundHabit?.name).toBe('Meditate Updated');
    expect(foundHabit?.description).toBe('Updated meditation description');
  });

  it('should toggle archive status of a habit', () => {
    const insertedHabit = service.addHabit(mockHabit);

    service.toggleArchive(insertedHabit.id);

    const foundHabit = service.getHabitById(insertedHabit.id);
    expect(foundHabit?.archived).toBeTruthy();
  });

  it('should create a habit entry when adding a habit', () => {
    const addEntrySpy = vi.spyOn(habitEntryServiceMock, 'addEntry');

    const insertedHabit = service.addHabit(mockHabit);

    expect(addEntrySpy).toHaveBeenCalledWith({
      habitId: insertedHabit.id,
      status: 'pending',
    });
  });

  it('should not allow adding a habit with an empty name', () => {
    const invalidHabit: HabitInput = {
      name: '',
      description: 'This should not be added',
    };

    expect(() => service.addHabit(invalidHabit)).toThrowError(
      'Habit name is required',
    );
  });

  it('should not allow adding two habits with the same name', () => {
    const insertedHabit = service.addHabit(mockHabit);

    expect(() => service.addHabit(insertedHabit)).toThrowError(
      'Two habits with the same name are not allowed',
    );
  });
});
