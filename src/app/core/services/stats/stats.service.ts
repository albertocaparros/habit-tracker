import { Injectable, inject } from '@angular/core';
import { DailyStats, HabitEntry, HabitStats } from '../../models';
import { HabitService } from '../habit/habit.service';
import { HabitEntryService } from '../habit-entry/habit-entry.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  readonly habitService = inject(HabitService);
  readonly habitEntryService = inject(HabitEntryService);

  getDailyStatsData(): { [key: string]: DailyStats } {
    const statsMap: { [key: string]: DailyStats } = {};
    const habits = this.habitService.getHabits()();
    const today = new Date();

    // 1. Find earliest habit creation date
    const earliestDate = habits
      .map((h) => new Date(h.createdAt))
      .reduce((min, date) => (date < min ? date : min), today);

    // 2. Build a map of entries by date and habit
    const entryMap = new Map<string, Map<string, HabitEntry>>();
    for (const habit of habits) {
      const entries = this.habitEntryService.getEntriesForHabit(habit.id);
      for (const entry of entries) {
        const dateKey = entry.date.slice(0, 10);
        if (!entryMap.has(dateKey)) {
          entryMap.set(dateKey, new Map());
        }
        entryMap.get(dateKey)!.set(habit.id, entry);
      }
    }

    // 3. Iterate through each day in the range
    for (
      let d = new Date(earliestDate);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().slice(0, 10);
      let total = 0;
      let completed = 0;

      for (const habit of habits) {
        const habitCreated = new Date(habit.createdAt);
        if (d >= habitCreated) {
          total++;
          const entry = entryMap.get(dateKey)?.get(habit.id);
          if (entry?.status === 'done') {
            completed++;
          }
        }
      }

      statsMap[dateKey] = { total, completed };
    }

    return statsMap;
  }

  getHabitStats(): HabitStats {
    const habits = this.habitService.getHabits()();

    let longestStreak = { days: 0, habitName: '' };
    let mostClearedHabit = { habitName: '', clearingPercentage: 0 };
    let leastClearedHabit = { habitName: '', clearingPercentage: 100 };
    const entriesByHabit = habits.map((habit) => ({
      habit,
      entries: this.habitEntryService.getEntriesForHabit(habit.id),
    }));
    let totalDone = 0;
    let totalEntries = 0;

    for (const { habit, entries } of entriesByHabit) {
      // Sort entries by date
      const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

      // Streak calculation
      let currentStreak = 0;
      let maxStreak = 0;
      let prevDate: string | null = null;

      for (const entry of sorted) {
        const isDone = entry.status === 'done';
        if (isDone) {
          if (
            prevDate &&
            new Date(entry.date).getTime() - new Date(prevDate).getTime() ===
              86400000
          ) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
        prevDate = entry.date;
      }

      if (maxStreak > longestStreak.days) {
        longestStreak = { days: maxStreak, habitName: habit.name };
      }

      // Clearing percentage
      const doneCount = entries.filter((e) => e.status === 'done').length;
      const percentage = entries.length
        ? (doneCount / entries.length) * 100
        : 0;

      if (percentage > mostClearedHabit.clearingPercentage) {
        mostClearedHabit = {
          habitName: habit.name,
          clearingPercentage: percentage,
        };
      }

      if (percentage < leastClearedHabit.clearingPercentage) {
        leastClearedHabit = {
          habitName: habit.name,
          clearingPercentage: percentage,
        };
      }

      totalDone += doneCount;
      totalEntries += entries.length;
    }

    return {
      longestStreak,
      mostClearedHabit,
      leastClearedHabit,
      completionRate: totalEntries ? (totalDone / totalEntries) * 100 : 0,
    } as HabitStats;
  }
}
