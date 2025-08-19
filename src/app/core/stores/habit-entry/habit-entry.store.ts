import { computed, Injectable, inject, signal } from '@angular/core';
import { Habit, HabitEntry, HabitEntryInput } from '../../models';
import { HabitEntryService } from '../../services';

@Injectable({ providedIn: 'root' })
export class HabitEntryStore {
  private habitEntryService = inject(HabitEntryService);
  readonly today = new Date().toISOString().slice(0, 10);

  private habit = signal<Habit | null>(null);
  private entries = signal<HabitEntry[]>([]);

  readonly habitEntries = computed(() => this.entries());
  readonly todayEntry = computed(() =>
    this.habitEntries().find((entry) => entry.date === this.today),
  );

  setHabit(habit: Habit) {
    this.habit.set(habit);
    const fetched = this.habitEntryService.getEntriesForHabit(habit.id);

    if (!fetched.find((entry) => entry.date === this.today)) {
      const todayEntry = this.habitEntryService.addEntry({
        habitId: habit.id,
        status: 'pending',
      } as HabitEntryInput);

      fetched.push(todayEntry);
    }

    this.entries.set(fetched);
  }

  switchTodayStatus() {
    this.habitEntryService.switchStatus(this.todayEntry()?.id || '');
    this.entries.set(
      this.habitEntryService.getEntriesForHabit(this.habit()?.id || ''),
    );
  }
}
