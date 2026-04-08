import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StatsService } from '../../../core/services';
import { CalendarHeatmap } from '../../../shared/components/calendar-heatmap/calendar-heatmap';

@Component({
  selector: 'app-overview-page',
  imports: [CalendarHeatmap, MatIcon],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  statsService = inject(StatsService);
  readonly today = new Date();

  readonly dailyData = this.statsService.dailyStatsData;
  readonly habitStats = this.statsService.habitStats;
}
