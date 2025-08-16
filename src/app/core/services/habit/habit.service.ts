import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Habit, HabitInput } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private habits = signal<Habit[]>([]);

  getHabits() {
    return this.habits();
  }

  getHabitById(id: string) {
    return this.habits().find((habit) => habit.id === id);
  }

  addHabit(habit: HabitInput): Habit {
    const newHabit: Habit = {
      ...habit,
      id: uuid(),
      createdAt: new Date().toISOString(),
      archived: false,
    };
    this.habits.update((h) => [...h, newHabit]);
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
