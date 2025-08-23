import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { HabitEntry } from '../../../core/models';

@Component({
  selector: 'app-streak-display',
  imports: [MatIcon],
  templateUrl: './streak-display.html',
  styleUrl: './streak-display.scss',
})
export class StreakDisplay {
  habitEntries = input<HabitEntry[]>();

  currentStreak = computed(() => {
    const entries = this.habitEntries();
    if (!entries || entries.length === 0) return 0;

    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    let streak = 0;
    const day = new Date();

    while (true) {
      const entry = sorted.find(
        (e) => e.date == day.toISOString().slice(0, 10),
      );

      if (entry?.status === 'done') {
        streak++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  });
}
