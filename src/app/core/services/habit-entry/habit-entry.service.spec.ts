import { TestBed } from '@angular/core/testing';
import { should } from 'vitest';
import {
  HabitEntry,
  HabitEntryInput,
  HabitEntryUpdate,
  HabitStatus,
} from '../../models';
import { HabitEntryService } from './habit-entry.service';

describe('HabitEntry', () => {
  let service: HabitEntryService;
  const mockEntry: HabitEntryInput = {
    habitId: 'habit-123',
    status: 'done',
    note: 'Felt great after this',
  };

  beforeEach(() => {
    service = new HabitEntryService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should add an entry', () => {
    const addedEntry: HabitEntry = service.addEntry(mockEntry);
    const entriesForHabit = service.getEntriesForHabit('habit-123');

    expect(entriesForHabit).toContain(addedEntry);
    expect(addedEntry.habitId).toBe('habit-123');
    expect(addedEntry.status).toBe('done');
    expect(addedEntry.note).toBe('Felt great after this');
    expect(addedEntry.id).toBeDefined();
    expect(addedEntry.date).toBeDefined();
  });

  it('should get all entries for a habit', () => {
    const mockEntry2: HabitEntryInput = {
      habitId: 'habit-123',
      status: 'skipped',
      note: 'Was too busy',
    };

    const addedEntry1 = service.addEntry(mockEntry);
    const addedEntry2 = service.addEntry(mockEntry2);
    const entries = service.getEntriesForHabit('habit-123');

    expect(entries.length).toBe(2);
    expect(entries).toContain(addedEntry1);
    expect(entries).toContain(addedEntry2);
  });

  it('should return an empty array for a habit with no entries', () => {
    const entries = service.getEntriesForHabit('empty-habit');
    expect(entries.length).toBe(0);
  });

  it('should get an entry by ID', () => {
    const addedEntry = service.addEntry(mockEntry);
    const foundEntry = service.getEntryById(addedEntry.id);

    expect(foundEntry).toEqual(addedEntry);
  });

  it('should return undefined for non-existing entry ID', () => {
    const foundEntry = service.getEntryById('non-existing-id');
    expect(foundEntry).toBeUndefined();
  });

  it('should update an entry', () => {
    const updatedEntry: HabitEntryUpdate = {
      status: 'skipped',
      note: 'Changed my mind',
    };

    const addedEntry = service.addEntry(mockEntry);
    service.updateEntry(addedEntry.id, updatedEntry);
    const foundEntry = service.getEntryById(addedEntry.id);

    expect(foundEntry?.status).toBe('skipped');
    expect(foundEntry?.note).toBe('Changed my mind');
  });

  it('should remove an entry', () => {
    const addedEntry = service.addEntry(mockEntry);
    service.removeEntry(addedEntry.id);
    const foundEntry = service.getEntryById(addedEntry.id);

    expect(foundEntry).toBeUndefined();
  });
});
