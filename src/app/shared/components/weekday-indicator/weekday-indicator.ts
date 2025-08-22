import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HabitEntry, HabitStatus } from '../../../core/models';

@Component({
  selector: 'app-weekday-indicator',
  imports: [NgClass],
  templateUrl: './weekday-indicator.html',
  styleUrl: './weekday-indicator.scss',
})
export class WeekdayIndicator {
  habitEntries = input<HabitEntry[]>();

  weekdayStatus = computed(() => {
    const today = new Date();
    const start = this.getStartOfWeek(new Date(today));
    const map: Record<string, HabitStatus> = {
      M: 'pending',
      T: 'pending',
      W: 'pending',
      Th: 'pending',
      F: 'pending',
      Sa: 'pending',
      Su: 'pending',
    };

    const entries = this.habitEntries() ?? [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      const iso = dayDate.toISOString().slice(0, 10);

      const entry = entries.find((e) => e.date === iso);
      const label = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'][i];
      map[label] = entry?.status ?? 'pending';
    }

    return map;
  });

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }
}
