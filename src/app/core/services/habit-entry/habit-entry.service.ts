import { Injectable, inject } from '@angular/core';
import { HabitEntryRepository } from '../../data/habit-entry.repository';
import { HabitEntry, HabitEntryInput, HabitEntryUpdate } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class HabitEntryService {
  private readonly repository = inject(HabitEntryRepository);

  getEntriesForHabit(habitId: string): HabitEntry[] {
    return this.repository.getEntriesForHabit(habitId);
  }

  getEntryById(id: string): HabitEntry | undefined {
    return this.repository.getEntryById(id);
  }

  addEntry(entry: HabitEntryInput): HabitEntry {
    return this.repository.addEntry(entry);
  }

  updateEntry(id: string, updatedEntry: HabitEntryUpdate): void {
    this.repository.updateEntry(id, updatedEntry);
  }

  removeEntry(id: string): void {
    this.repository.removeEntry(id);
  }

  switchStatus(id: string): void {
    this.repository.switchStatus(id);
  }
}
