import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import {
  HabitEntry,
  HabitEntryInput,
  HabitEntryUpdate,
  HabitStatus,
} from '../../models';
import { mockHabitEntries } from './mock-habit-entries';

@Injectable({
  providedIn: 'root',
})
export class HabitEntryService {
  private entries = signal<HabitEntry[]>(mockHabitEntries);

  getEntriesForHabit(habitId: string): HabitEntry[] {
    return this.entries().filter((entry) => entry.habitId === habitId);
  }

  getEntryById(id: string): HabitEntry | undefined {
    return this.entries().find((entry) => entry.id === id);
  }

  addEntry(entry: HabitEntryInput): HabitEntry {
    const newEntry: HabitEntry = {
      id: uuid(),
      ...entry,
      date: new Date().toISOString().slice(0, 10),
    };

    this.entries.update((e) => [...e, newEntry]);
    return newEntry;
  }

  updateEntry(id: string, updatedEntry: HabitEntryUpdate): void {
    if (!id?.trim()) {
      throw new Error('Entry ID is required');
    }

    const existingEntry = this.getEntryById(id);
    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    this.entries.update((e) =>
      e.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
  }

  removeEntry(id: string) {
    if (!id?.trim()) {
      throw new Error('Entry ID is required');
    }

    const existingEntry = this.getEntryById(id);
    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    this.entries.update((e) => e.filter((entry) => entry.id !== id));
  }

  switchStatus(id: string): void {
    if (!id?.trim()) {
      throw new Error('Entry ID is required');
    }

    const existingEntry = this.getEntryById(id);
    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    this.entries.update((e) =>
      e.map((entry) =>
        entry.id === id
          ? { ...entry, status: this.shuffleStatus(entry.status) }
          : entry,
      ),
    );
  }

  private shuffleStatus(currentStatus: HabitStatus): HabitStatus {
    const statuses: HabitStatus[] = ['done', 'missed', 'pending'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    return statuses[nextIndex];
  }
}
