import { computed, Injectable, inject, signal } from '@angular/core';
import { DATE_CLOCK } from '../../lib/clock/date-clock';
import { Habit, HabitEntry, HabitEntryInput } from '../../models';
import { HabitEntryService } from '../../services';

@Injectable({ providedIn: 'root' })
export class HabitEntryStore {
  private habitEntryService = inject(HabitEntryService);
  private readonly clock = inject(DATE_CLOCK);

  private habit = signal<Habit | null>(null);
  private entries = signal<HabitEntry[]>([]);

  readonly habitEntries = computed(() => this.entries());
  readonly todayEntry = computed(() =>
    this.habitEntries().find(
      (entry) => entry.date === this.clock.todayUtcIsoDate(),
    ),
  );

  setHabit(habit: Habit) {
    this.habit.set(habit);
    const fetched = [...this.habitEntryService.getEntriesForHabit(habit.id)];
    const todayKey = this.clock.todayUtcIsoDate();

    if (!fetched.find((entry) => entry.date === todayKey)) {
      const todayEntry = this.habitEntryService.addEntry({
        habitId: habit.id,
        status: 'pending',
      } as HabitEntryInput);

      fetched.push(todayEntry);
    }

    this.entries.set(fetched);
  }

  switchTodayStatus() {
    const todayId = this.todayEntry()?.id;
    if (!todayId) {
      return;
    }
    this.habitEntryService.switchStatus(todayId);
    this.entries.set(
      this.habitEntryService.getEntriesForHabit(this.habit()?.id || ''),
    );
  }
}
