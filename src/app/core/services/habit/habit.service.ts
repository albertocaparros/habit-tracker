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
    if (!habit.name) {
      throw new Error('Habit name is required');
    }

    if (this.habits().find((h) => h.name === habit.name)) {
      throw new Error('Two habits with the same name are not allowed');
    }

    const newHabit: Habit = {
      id: uuid(),
      ...habit,
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
    this.habits.update((h) => h.filter((habit) => habit.id !== id));
  }

  updateHabit(updatedHabit: HabitInput, id: string) {
    this.habits.update((h) =>
      h.map((habit) =>
        habit.id === id ? { ...habit, ...updatedHabit } : habit,
      ),
    );
  }

  toggleArchive(id: string) {
    this.habits.update((h) =>
      h.map((habit) =>
        habit.id === id ? { ...habit, archived: !habit.archived } : habit,
      ),
    );
  }
}
