import { computed, Injectable, inject } from '@angular/core';
import { DATE_CLOCK } from '../../lib/clock/date-clock';
import {
  buildDailyStatsData,
  buildHabitStats,
} from '../../lib/stats/stats-calculations';
import { HabitService } from '../habit/habit.service';
import { HabitEntryService } from '../habit-entry/habit-entry.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  readonly habitService = inject(HabitService);
  readonly habitEntryService = inject(HabitEntryService);
  private readonly clock = inject(DATE_CLOCK);

  readonly dailyStatsData = computed(() =>
    buildDailyStatsData(
      this.habitService.getHabits()(),
      (id) => this.habitEntryService.getEntriesForHabit(id),
      this.clock.now(),
    ),
  );

  readonly habitStats = computed(() =>
    buildHabitStats(this.habitService.getHabits()(), (id) =>
      this.habitEntryService.getEntriesForHabit(id),
    ),
  );

  getDailyStatsData(): ReturnType<typeof buildDailyStatsData> {
    return this.dailyStatsData();
  }

  getHabitStats(): ReturnType<typeof buildHabitStats> {
    return this.habitStats();
  }
}
