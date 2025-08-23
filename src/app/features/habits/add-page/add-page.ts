import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { HabitInput } from '../../../core/models';
import { HabitService } from '../../../core/services';
import { HabitForm } from '../../../shared/components/habit-form/habit-form';

@Component({
  selector: 'app-add-page',
  imports: [RouterLink, MatButton, HabitForm],
  templateUrl: './add-page.html',
  styleUrl: './add-page.scss',
})
export class AddPage {
  habitService = inject(HabitService);
  router = inject(Router);
  @ViewChild(HabitForm) habitFormComponent!: HabitForm;

  isFormValid = signal<boolean>(false);

  triggerSave() {
    this.habitFormComponent.onSubmit();
  }

  saveHabit(habitInput: HabitInput) {
    try {
      this.habitService.addHabit(habitInput);
      this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof Error) {
        this.habitFormComponent.setFieldError('name', error.message);
      }
    }
  }
}
