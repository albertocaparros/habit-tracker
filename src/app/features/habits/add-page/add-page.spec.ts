import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { HabitService } from '../../../core/services';
import { AddPage } from './add-page';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;
  let habitServiceMock: HabitService;

  beforeEach(async () => {
    habitServiceMock = {
      getHabits: vi.fn().mockReturnValue([]),
      addHabit: vi.fn(),
      getHabitById: vi.fn(),
    } as unknown as HabitService;

    await TestBed.configureTestingModule({
      imports: [AddPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HabitService, useValue: habitServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the habits page on cancel', () => {
    const cancelButton = fixture.nativeElement.querySelector(
      '[data-testid="cancel-button"]',
    );
    cancelButton.click();

    expect(cancelButton.getAttribute('routerLink')).toBe('/');
  });

  it('should have save button disabled when the form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector(
      '[data-testid="save-button"]',
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should trigger form submission when clicking the save button', () => {
    component.habitFormComponent.habitForm.setValue({
      name: 'Test Habit',
      topic: 'Health',
    });

    const formSubmitSpy = vi.spyOn(component.habitFormComponent, 'onSubmit');
    const submitButton = fixture.nativeElement.querySelector(
      '[data-testid="save-button"]',
    );
    fixture.detectChanges();

    submitButton.click();

    expect(formSubmitSpy).toHaveBeenCalled();
    expect(habitServiceMock.addHabit).toHaveBeenCalledWith({
      name: 'Test Habit',
      icon: 'Health',
    });
  });
});
