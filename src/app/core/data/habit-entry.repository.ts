import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import {
  HabitEntry,
  HabitEntryInput,
  HabitEntryUpdate,
  HabitStatus,
} from '../models';
import { mockHabitEntries } from '../services/habit-entry/mock-habit-entries';
import { STORAGE_ENTRIES_KEY } from './storage-keys';

@Injectable({ providedIn: 'root' })
export class HabitEntryRepository {
  private readonly _entries = signal<HabitEntry[]>(this.readInitial());

  readonly entries = this._entries.asReadonly();

  private readInitial(): HabitEntry[] {
    if (typeof localStorage === 'undefined') {
      return [...mockHabitEntries];
    }
    try {
      const raw = localStorage.getItem(STORAGE_ENTRIES_KEY);
      if (!raw) {
        const initial = [...mockHabitEntries];
        localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw) as HabitEntry[];
    } catch {
      return [...mockHabitEntries];
    }
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(this._entries()));
  }

  getEntriesForHabit(habitId: string): HabitEntry[] {
    return this._entries().filter((entry) => entry.habitId === habitId);
  }

  getEntryById(id: string): HabitEntry | undefined {
    return this._entries().find((entry) => entry.id === id);
  }

  addEntry(entry: HabitEntryInput): HabitEntry {
    const newEntry: HabitEntry = {
      id: uuid(),
      ...entry,
      date: new Date().toISOString().slice(0, 10),
    };

    this._entries.update((e) => [...e, newEntry]);
    this.persist();
    return newEntry;
  }

  updateEntry(id: string, updatedEntry: HabitEntryUpdate): void {
    this._entries.update((e) =>
      e.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
    this.persist();
  }

  removeEntry(id: string): void {
    this._entries.update((e) => e.filter((entry) => entry.id !== id));
    this.persist();
  }

  switchStatus(id: string): void {
    this._entries.update((e) =>
      e.map((entry) =>
        entry.id === id
          ? { ...entry, status: this.shuffleStatus(entry.status) }
          : entry,
      ),
    );
    this.persist();
  }

  private shuffleStatus(currentStatus: HabitStatus): HabitStatus {
    const statuses: HabitStatus[] = ['done', 'missed', 'pending'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    return statuses[nextIndex];
  }
}
