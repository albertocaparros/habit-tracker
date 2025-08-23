import {
  Component,
  EventEmitter,
  Input,
  inject,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Habit, HabitInput } from '../../../core/models';

@Component({
  selector: 'app-habit-form',
  imports: [
    MatFormField,
    MatInputModule,
    MatIcon,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.scss',
})
export class HabitForm {
  @Input() habit?: Habit;
  @Output() submitHabit = new EventEmitter<HabitInput>();
  @Output() formStatusChange = new EventEmitter<boolean>();
  @ViewChildren('topicButton') topicButtons!: QueryList<MatButtonToggle>;
  fb = inject(FormBuilder);

  habitForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    topic: ['', Validators.required],
  });

  topics = [
    { name: 'Home', icon: 'home' },
    { name: 'Productivity', icon: 'work' },
    { name: 'Relationships', icon: 'people' },
    { name: 'Health', icon: 'health_and_safety' },
    { name: 'Self-improvement', icon: 'self_improvement' },
    { name: 'Finance', icon: 'savings' },
    { name: 'Creativity', icon: 'brush' },
    { name: 'Mindfulness', icon: 'spa' },
    { name: 'Learning', icon: 'school' },
    { name: 'Digital Wellbeing', icon: 'devices' },
    { name: 'Community', icon: 'volunteer_activism' },
    { name: 'Pets & Animals', icon: 'pets' },
  ];

  ngOnInit(): void {
    this.habitForm.statusChanges.subscribe(() => {
      this.formStatusChange.emit(this.habitForm.valid);
    });

    if (this.habit) {
      this.habitForm.patchValue({
        name: this.habit.name,
        topic: this.habit.icon,
      });
    }
  }

  ngAfterViewInit() {
    if (this.habit) {
      this.scrollToSelectedIcon();
    }
  }

  private scrollToSelectedIcon() {
    setTimeout(() => {
      const selected = this.topicButtons.find(
        (btn) => btn.value === this.habitForm.value.topic,
      );
      selected?._buttonElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    });
  }

  onTopicChange(event: MatButtonToggleChange) {
    this.habitForm.patchValue({ topic: event.value });
    this.scrollToSelectedIcon();
  }

  onSubmit(): void {
    if (this.habitForm.invalid) {
      this.habitForm.markAllAsTouched();
      return;
    }

    const habitData = this.habitForm.value as { name: string; topic: string };
    const habitEntry: HabitInput = {
      name: this.capitalizeFirstLetter(habitData.name),
      icon: habitData.topic,
    };

    this.submitHabit.emit(habitEntry);
  }

  setFieldError(field: string, errorKey: string, errorMessage?: string) {
    const control = this.habitForm.get(field);
    if (control) {
      control.setErrors({
        ...control.errors,
        [errorKey]: errorMessage || true,
      });
    }
  }

  private capitalizeFirstLetter(string: string): string {
    return [...string][0].toUpperCase() + [...string].slice(1).join('');
  }
}
