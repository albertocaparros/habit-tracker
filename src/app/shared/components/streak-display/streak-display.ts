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
    const today = new Date();
    const currentDay = new Date(today);

    while (true) {
      const iso = currentDay.toISOString().slice(0, 10);
      const entry = sorted.find((e) => e.date === iso);

      if (entry?.status === 'done') {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  });
}
