export type HabitStatus = 'done' | 'skipped' | 'missed';

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // ISO date
  status: HabitStatus;
  note?: string;
}

export type HabitEntryInput = Omit<HabitEntry, 'id' | 'date'>;
export type HabitEntryUpdate = Omit<HabitEntry, 'id' | 'date' | 'habitId'>;
