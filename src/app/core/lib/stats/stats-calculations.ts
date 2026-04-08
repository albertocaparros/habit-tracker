import type { DailyStats, Habit, HabitEntry, HabitStats } from '../../models';

const MS_PER_DAY = 86_400_000;

export function longestDoneStreakDays(entries: HabitEntry[]): number {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  let currentStreak = 0;
  let maxStreak = 0;
  let prevDate: string | null = null;

  for (const entry of sorted) {
    const isDone = entry.status === 'done';
    if (isDone) {
      if (
        prevDate &&
        new Date(entry.date).getTime() - new Date(prevDate).getTime() ===
          MS_PER_DAY
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

  return maxStreak;
}

export function buildDailyStatsData(
  habits: Habit[],
  getEntriesForHabit: (habitId: string) => HabitEntry[],
  endDate: Date,
): Record<string, DailyStats> {
  const statsMap: Record<string, DailyStats> = {};
  if (habits.length === 0) {
    return statsMap;
  }

  const today = endDate;
  const earliestDate = habits
    .map((h) => new Date(h.createdAt))
    .reduce((min, date) => (date < min ? date : min), today);

  const entryMap = new Map<string, Map<string, HabitEntry>>();
  for (const habit of habits) {
    const entries = getEntriesForHabit(habit.id);
    for (const entry of entries) {
      const dateKey = entry.date.slice(0, 10);
      if (!entryMap.has(dateKey)) {
        entryMap.set(dateKey, new Map());
      }
      entryMap.get(dateKey)!.set(habit.id, entry);
    }
  }

  for (let d = new Date(earliestDate); d <= today; d.setDate(d.getDate() + 1)) {
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

export function buildHabitStats(
  habits: Habit[],
  getEntriesForHabit: (habitId: string) => HabitEntry[],
): HabitStats {
  let longestStreak = { days: 0, habitName: '' };
  let mostClearedHabit = { habitName: '', clearingPercentage: 0 };
  let leastClearedHabit = { habitName: '', clearingPercentage: 100 };
  let totalDone = 0;
  let totalEntries = 0;

  for (const habit of habits) {
    const entries = getEntriesForHabit(habit.id);
    const maxStreak = longestDoneStreakDays(entries);

    if (maxStreak > longestStreak.days) {
      longestStreak = { days: maxStreak, habitName: habit.name };
    }

    const doneCount = entries.filter((e) => e.status === 'done').length;
    const percentage = entries.length ? (doneCount / entries.length) * 100 : 0;

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
