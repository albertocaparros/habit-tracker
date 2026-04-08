import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Habit, HabitInput } from '../models';
import { mockHabits } from '../services/habit/mock-habits';
import { STORAGE_HABITS_KEY } from './storage-keys';

@Injectable({ providedIn: 'root' })
export class HabitRepository {
  private readonly _habits = signal<Habit[]>(this.readInitial());

  /** Read-only signal of all habits (persisted to `localStorage`). */
  readonly habits = this._habits.asReadonly();

  private readInitial(): Habit[] {
    if (typeof localStorage === 'undefined') {
      return [...mockHabits];
    }
    try {
      const raw = localStorage.getItem(STORAGE_HABITS_KEY);
      if (!raw) {
        const initial = [...mockHabits];
        localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw) as Habit[];
    } catch {
      return [...mockHabits];
    }
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(this._habits()));
  }

  getHabitById(id: string): Habit | undefined {
    return this._habits().find((h) => h.id === id);
  }

  addHabit(habit: HabitInput): Habit {
    if (!habit.name) {
      throw new Error('required');
    }

    const normalizedName = habit.name.trim().toLowerCase();
    if (
      this._habits().find((h) => h.name.trim().toLowerCase() === normalizedName)
    ) {
      throw new Error('duplicated');
    }

    const newHabit: Habit = {
      id: uuid(),
      ...habit,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this._habits.update((h) => [...h, newHabit]);
    this.persist();
    return newHabit;
  }

  removeHabit(id: string): void {
    this._habits.update((h) => h.filter((habit) => habit.id !== id));
    this.persist();
  }

  updateHabit(updated: HabitInput, id: string): void {
    const normalizedName = updated.name.trim().toLowerCase();
    if (
      this._habits().find(
        (h) => h.name.trim().toLowerCase() === normalizedName && h.id !== id,
      )
    ) {
      throw new Error('duplicated');
    }

    this._habits.update((list) =>
      list.map((habit) => (habit.id === id ? { ...habit, ...updated } : habit)),
    );
    this.persist();
  }
}
