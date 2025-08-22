import { Injectable, inject, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Habit, HabitInput } from '../../models';
import { HabitEntryService } from '../habit-entry/habit-entry.service';
import { mockHabits } from './mock-habits';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private habits = signal<Habit[]>(mockHabits);
  habitEntryService = inject(HabitEntryService);

  getHabits = () => this.habits;

  getHabitById(id: string) {
    return this.habits().find((habit) => habit.id === id);
  }

  addHabit(habit: HabitInput): Habit {
    if (!habit.name?.trim()) {
      throw new Error('Habit name is required');
    }

    const trimmedName = habit.name.trim();
    if (
      this.habits().find(
        (h) => h.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      throw new Error('Two habits with the same name are not allowed');
    }

    const newHabit: Habit = {
      id: uuid(),
      ...habit,
      name: trimmedName,
      createdAt: new Date().toISOString().slice(0, 10),
      archived: false,
    };
    this.habits.update((h) => [...h, newHabit]);

    this.habitEntryService.addEntry({
      habitId: newHabit.id,
      status: 'pending',
    });

    return newHabit;
  }

  removeHabit(id: string) {
    if (!id?.trim()) {
      throw new Error('Habit ID is required');
    }

    const existingHabit = this.getHabitById(id);
    if (!existingHabit) {
      throw new Error('Habit not found');
    }

    this.habits.update((h) => h.filter((habit) => habit.id !== id));
  }

  updateHabit(updatedHabit: HabitInput, id: string) {
    if (!id?.trim()) {
      throw new Error('Habit ID is required');
    }

    if (!updatedHabit.name?.trim()) {
      throw new Error('Habit name is required');
    }

    const existingHabit = this.getHabitById(id);
    if (!existingHabit) {
      throw new Error('Habit not found');
    }

    const trimmedName = updatedHabit.name.trim();
    const duplicateHabit = this.habits().find(
      (h) => h.id !== id && h.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicateHabit) {
      throw new Error('Two habits with the same name are not allowed');
    }

    this.habits.update((h) =>
      h.map((habit) =>
        habit.id === id
          ? { ...habit, ...updatedHabit, name: trimmedName }
          : habit,
      ),
    );
  }

  toggleArchive(id: string) {
    if (!id?.trim()) {
      throw new Error('Habit ID is required');
    }

    const existingHabit = this.getHabitById(id);
    if (!existingHabit) {
      throw new Error('Habit not found');
    }

    this.habits.update((h) =>
      h.map((habit) =>
        habit.id === id ? { ...habit, archived: !habit.archived } : habit,
      ),
    );
  }
}
