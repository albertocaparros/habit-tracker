import { Component, inject, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Habit } from '../../../core/models';
import { HabitEntryStore } from '../../../core/stores/habit-entry/habit-entry.store';
import { StreakDisplay } from '../../components/streak-display/streak-display';
import { WeekdayIndicator } from '../weekday-indicator/weekday-indicator';

@Component({
  selector: 'app-habit-card',
  imports: [
    MatIcon,
    MatExpansionModule,
    WeekdayIndicator,
    StreakDisplay,
    RouterLink,
  ],
  providers: [HabitEntryStore],
  templateUrl: './habit-card.html',
  styleUrl: './habit-card.scss',
})
export class HabitCard {
  habitEntryStore = inject(HabitEntryStore);
  habit = input.required<Habit>();
  habitEntries = this.habitEntryStore.habitEntries;
  todayEntry = this.habitEntryStore.todayEntry;

  ngOnInit() {
    this.habitEntryStore.setHabit(this.habit());
  }

  switchStatus = (e: MouseEvent) => {
    e.stopPropagation();
    this.habitEntryStore.switchTodayStatus();
  };
}
