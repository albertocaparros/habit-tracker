import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DailyStats, Habit, HabitStats } from '../../../core/models';
import { StatsService } from '../../../core/services';
import { CalendarHeatmap } from '../../../shared/components/calendar-heatmap/calendar-heatmap';

@Component({
  selector: 'app-overview-page',
  imports: [CalendarHeatmap, MatIcon],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.scss',
})
export class OverviewPage {
  statsService = inject(StatsService);
  readonly today = new Date();

  habits = signal<Habit[]>([]);
  dailyData = signal<{ [key: string]: DailyStats }>({});

  habitStats = signal<HabitStats>({
    longestStreak: { days: 0, habitName: '' },
    mostClearedHabit: { habitName: '', clearingPercentage: 0 },
    leastClearedHabit: { habitName: '', clearingPercentage: 0 },
    completionRate: 0,
  });

  ngOnInit() {
    this.dailyData.set(this.statsService.getDailyStatsData());
    this.habitStats.set(this.statsService.getHabitStats());
  }
}
