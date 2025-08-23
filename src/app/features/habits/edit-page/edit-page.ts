import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Habit, HabitInput } from '../../../core/models';
import { HabitService } from '../../../core/services';
import { HabitForm } from '../../../shared/components';

@Component({
  selector: 'app-edit-page',
  imports: [HabitForm, RouterLink, MatButton],
  templateUrl: './edit-page.html',
  styleUrl: './edit-page.scss',
})
export class EditPage {
  route = inject(ActivatedRoute);
  habitService = inject(HabitService);
  router = inject(Router);

  @ViewChild(HabitForm) habitFormComponent!: HabitForm;
  id = this.route.snapshot.paramMap.get('id');
  isFormValid = signal<boolean>(false);
  habit = signal<Habit | undefined>(undefined);
  deleteStatus = signal<'Delete' | 'Are you sure?'>('Delete');
  highlightDelete = false;

  ngOnInit() {
    if (this.id) {
      this.habit.set(this.habitService.getHabitById(this.id));
    }
  }

  triggerSave() {
    this.habitFormComponent.onSubmit();
  }

  deleteHabit() {
    if (!this.id) {
      return;
    }

    if (this.deleteStatus() === 'Are you sure?') {
      this.habitService.removeHabit(this.id);
      this.router.navigate(['/']);
    } else {
      this.deleteStatus.set('Are you sure?');
      this.highlightDelete = true;
    }
  }

  saveHabit(habitInput: HabitInput) {
    if (this.id) {
      try {
        this.habitService.updateHabit(habitInput, this.id);
        this.router.navigate(['/']);
      } catch (error) {
        if (error instanceof Error) {
          this.habitFormComponent.setFieldError('name', error.message);
        }
      }
    }
  }
}
