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

  getHabitById(id: string): Habit | undefined {
    return this.habits().find((habit) => habit.id === id);
  }

  addHabit(habit: HabitInput): Habit {
    if (!habit.name) {
      throw new Error('required');
    }

    const normalizedName = habit.name.trim().toLowerCase();
    if (
      this.habits().find((h) => h.name.trim().toLowerCase() === normalizedName)
    ) {
      throw new Error('duplicated');
    }

    const newHabit: Habit = {
      id: uuid(),
      ...habit,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.habits.update((h) => [...h, newHabit]);

    this.habitEntryService.addEntry({
      habitId: newHabit.id,
      status: 'pending',
    });

    return newHabit;
  }

  removeHabit(id: string) {
    this.habits.update((h) => h.filter((habit) => habit.id !== id));
  }

  updateHabit(updatedHabit: HabitInput, id: string) {
    const normalizedName = updatedHabit.name.trim().toLowerCase();
    if (
      this.habits().find(
        (h) => h.name.trim().toLowerCase() === normalizedName && h.id !== id,
      )
    ) {
      throw new Error('duplicated');
    }

    this.habits.update((h) =>
      h.map((habit) =>
        habit.id === id ? { ...habit, ...updatedHabit } : habit,
      ),
    );
  }
}
