export interface Habit {
  id: string;
  name: string;
  icon: string;
  description?: string;
  createdAt: string; // ISO date
}

export type HabitInput = Omit<Habit, 'id' | 'createdAt'>;
