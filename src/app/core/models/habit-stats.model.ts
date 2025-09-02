export interface DailyStats {
  total: number;
  completed: number;
}

export interface HabitStats {
  longestStreak: { days: number; habitName: string };
  mostClearedHabit: { habitName: string; clearingPercentage: number };
  leastClearedHabit: { habitName: string; clearingPercentage: number };
  completionRate: number;
}
