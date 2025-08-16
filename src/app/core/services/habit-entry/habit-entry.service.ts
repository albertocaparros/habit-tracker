import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { HabitEntry, HabitEntryInput, HabitEntryUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class HabitEntryService {
  private entries = signal<HabitEntry[]>([]);

  getEntriesForHabit(habitId: string): HabitEntry[] {
    return this.entries().filter((entry) => entry.habitId === habitId);
  }

  getEntryById(id: string): HabitEntry | undefined {
    return this.entries().find((entry) => entry.id === id);
  }

  addEntry(entry: HabitEntryInput): HabitEntry {
    const newEntry: HabitEntry = {
      ...entry,
      id: uuid(),
      date: new Date().toISOString(),
    };

    this.entries.update((e) => [...e, newEntry]);
    return newEntry;
  }

  updateEntry(id: string, updatedEntry: HabitEntryUpdate): void {
    this.entries.update((e) =>
      e.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
  }

  removeEntry(id: string) {
    this.entries.update((e) => e.filter((entry) => entry.id !== id));
  }
}
