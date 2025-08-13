export type HabitStatus = 'done' | 'skipped' | 'missed';

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // ISO date
  status: HabitStatus;
  note?: string;
}
