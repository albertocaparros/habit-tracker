export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO date
  archived: boolean;
}

export type HabitInput = Omit<Habit, 'id' | 'createdAt' | 'archived'>;
