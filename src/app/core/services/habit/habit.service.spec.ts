import { Habit, HabitInput } from '../../models';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;

  beforeEach(() => {
    service = new HabitService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should add a habit', () => {
    const habit: HabitInput = {
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
    };

    const insertedHabit: Habit = service.addHabit(habit);

    expect(service.getHabits()).toContain(insertedHabit);
  });

  it('should get all habits', () => {
    const habit: HabitInput = {
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
    };
    const habit2 = {
      name: 'Exercise',
      description: 'Daily workout routine',
    };

    const insertedHabit1 = service.addHabit(habit);
    const insertedHabit2 = service.addHabit(habit2);

    expect(service.getHabits()).toContain(insertedHabit1);
    expect(service.getHabits()).toContain(insertedHabit2);
  });

  it('should get a habit by ID', () => {
    const habit: HabitInput = {
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
    };

    const insertedHabit = service.addHabit(habit);
    const foundHabit = service.getHabitById(insertedHabit.id);

    expect(foundHabit).toEqual(insertedHabit);
  });

  it('should return undefined for non-existing habit ID', () => {
    const foundHabit = service.getHabitById('non-existing-id');
    expect(foundHabit).toBeUndefined();
  });

  it('should remove a habit', () => {
    const habit: HabitInput = {
      name: 'Read',
      description: 'Read a book daily',
    };

    const insertedHabit = service.addHabit(habit);
    service.removeHabit(insertedHabit.id);
    expect(service.getHabits()).not.toContain(insertedHabit);
  });

  it('should update a habit', () => {
    const habit: HabitInput = {
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
    };

    const insertedHabit = service.addHabit(habit);
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
    const habit: HabitInput = {
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
    };

    const insertedHabit = service.addHabit(habit);
    service.toggleArchive(insertedHabit.id);
    const foundHabit = service.getHabitById(insertedHabit.id);

    expect(foundHabit?.archived).toBeTruthy();
  });
});
