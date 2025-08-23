import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Habit } from '../../../core/models';
import { HabitForm } from './habit-form';

describe('HabitForm', () => {
  let component: HabitForm;
  let fixture: ComponentFixture<HabitForm>;
  const habitInput: Habit = {
    id: 'habit-1',
    name: 'Daily Meditation',
    icon: 'self_improvement',
    description: '10 minutes of mindfulness',
    createdAt: '2025-08-01',
  };

  beforeEach(async () => {
    Element.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      imports: [HabitForm],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitForm);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('habit', habitInput);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should present the name field and topic toggle', () => {
    const nameField = fixture.nativeElement.querySelector(
      'input[formControlName="name"]',
    );
    const topicToggle = fixture.nativeElement.querySelectorAll(
      'mat-button-toggle[formControlName="topic"]',
    );

    expect(nameField).toBeTruthy();
    expect(topicToggle).toBeTruthy();
  });

  it('should emit submitHabit event on form submission with capitalized name', () => {
    const emitSpy = vi.spyOn(component.submitHabit, 'emit');

    component.habitForm.setValue({
      name: 'drink water',
      topic: 'health_and_safety',
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Drink water',
      icon: 'health_and_safety',
    });
  });

  it('should show validation errors for empty form', () => {
    const nameControl = component.habitForm.get('name');
    const topicControl = component.habitForm.get('topic');
    component.habitForm.setValue({
      name: '',
      topic: '',
    });

    component.onSubmit();
    fixture.detectChanges();

    const requiredNameErrorElement = fixture.nativeElement.querySelector(
      'mat-error[data-testid="required-name-error"]',
    );
    const requiredTopicErrorElement = fixture.nativeElement.querySelector(
      'mat-error[data-testid="required-topic-error"]',
    );
    expect(component.habitForm.valid).toBeFalsy();
    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(topicControl?.hasError('required')).toBeTruthy();
    expect(requiredNameErrorElement).toBeTruthy();
    expect(requiredTopicErrorElement).toBeTruthy();
  });

  it('should show validation error for name field shorter than 3 characters', () => {
    const nameControl = component.habitForm.get('name');
    component.habitForm.setValue({
      name: 'ab',
      topic: 'health_and_safety',
    });

    component.onSubmit();
    fixture.detectChanges();

    const minlengthNameErrorElement = fixture.nativeElement.querySelector(
      'mat-error[data-testid="minlength-name-error"]',
    );
    expect(component.habitForm.valid).toBeFalsy();
    expect(nameControl?.hasError('minlength')).toBeTruthy();
    expect(minlengthNameErrorElement).toBeTruthy();
  });

  it('should show validation error for duplicated habit name', () => {
    const nameControl = component.habitForm.get('name');
    component.setFieldError('name', 'duplicated');

    component.onSubmit();
    fixture.detectChanges();

    const duplicatedNameErrorElement = fixture.nativeElement.querySelector(
      'mat-error[data-testid="duplicated-name-error"]',
    );
    expect(component.habitForm.valid).toBeFalsy();
    expect(nameControl?.hasError('duplicated')).toBeTruthy();
    expect(duplicatedNameErrorElement).toBeTruthy();
  });

  it('should be loaded with habit data', () => {
    expect(component.habitForm.get('name')?.value).toBe(habitInput.name);
    expect(component.habitForm.get('topic')?.value).toBe(habitInput.icon);
  });
});
