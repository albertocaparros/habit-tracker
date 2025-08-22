import { computed, Injectable, inject, signal } from '@angular/core';
import { Habit, HabitEntry, HabitEntryInput } from '../../models';
import { HabitEntryService } from '../../services';

@Injectable({ providedIn: 'root' })
export class HabitEntryStore {
  private habitEntryService = inject(HabitEntryService);
  private readonly today = new Date().toISOString().slice(0, 10);

  private habit = signal<Habit | null>(null);
  private entries = signal<HabitEntry[]>([]);

  readonly habitEntries = computed(() => this.entries());
  readonly todayEntry = computed(() =>
    this.habitEntries().find((entry) => entry.date === this.today),
  );

  setHabit(habit: Habit) {
    if (!habit?.id) {
      console.warn('Cannot set habit: invalid habit provided');
      return;
    }

    this.habit.set(habit);
    const fetched = this.habitEntryService.getEntriesForHabit(habit.id);

    if (!fetched.find((entry) => entry.date === this.today)) {
      const todayEntry = this.habitEntryService.addEntry({
        habitId: habit.id,
        status: 'pending',
      });

      fetched.push(todayEntry);
    }

    this.entries.set(fetched);
  }

  switchTodayStatus() {
    const todayEntry = this.todayEntry();
    const habit = this.habit();

    if (!todayEntry?.id || !habit?.id) {
      console.warn('Cannot switch status: missing today entry or habit');
      return;
    }

    this.habitEntryService.switchStatus(todayEntry.id);
    this.entries.set(this.habitEntryService.getEntriesForHabit(habit.id));
  }
}
