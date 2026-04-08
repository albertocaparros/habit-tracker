import { Injectable, inject } from '@angular/core';
import { HabitRepository } from '../../data/habit.repository';
import { Habit, HabitInput } from '../../models';
import { HabitEntryService } from '../habit-entry/habit-entry.service';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private readonly habitRepository = inject(HabitRepository);
  habitEntryService = inject(HabitEntryService);

  getHabits = () => this.habitRepository.habits;

  getHabitById(id: string): Habit | undefined {
    return this.habitRepository.getHabitById(id);
  }

  addHabit(habit: HabitInput): Habit {
    const newHabit = this.habitRepository.addHabit(habit);
    this.habitEntryService.addEntry({
      habitId: newHabit.id,
      status: 'pending',
    });
    return newHabit;
  }

  removeHabit(id: string): void {
    this.habitRepository.removeHabit(id);
  }

  updateHabit(updatedHabit: HabitInput, id: string): void {
    this.habitRepository.updateHabit(updatedHabit, id);
  }
}
