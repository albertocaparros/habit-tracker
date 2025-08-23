import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Habit } from '../../../core/models';
import { HabitService } from '../../../core/services';
import { EditPage } from './edit-page';

describe('EditPage', () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;
  let habitServiceMock: HabitService;
  const loadedHabit: Habit = {
    id: '42',
    name: 'Test Habit',
    icon: 'Health',
    createdAt: '2023-01-01',
  };
  const mockActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({ id: '42' }),
    },
  };

  beforeEach(async () => {
    habitServiceMock = {
      getHabits: vi.fn().mockReturnValue([]),
      addHabit: vi.fn(),
      getHabitById: vi.fn().mockReturnValue(loadedHabit),
      updateHabit: vi.fn(),
      removeHabit: vi.fn(),
    } as unknown as HabitService;

    await TestBed.configureTestingModule({
      imports: [EditPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HabitService, useValue: habitServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPage);
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
    component.habitFormComponent.habitForm.setValue({
      name: '',
      topic: '',
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '[data-testid="save-button"]',
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should load the habit data on init', () => {
    component.ngOnInit();

    expect(component.habit()).toEqual(loadedHabit);
  });

  it('should trigger form submission when clicking the save button', () => {
    const formSubmitSpy = vi.spyOn(component.habitFormComponent, 'onSubmit');
    const submitButton = fixture.nativeElement.querySelector(
      '[data-testid="save-button"]',
    );
    fixture.detectChanges();

    submitButton.click();

    expect(formSubmitSpy).toHaveBeenCalled();
    expect(habitServiceMock.updateHabit).toHaveBeenCalledWith(
      {
        name: 'Test Habit',
        icon: 'Health',
      },
      '42',
    );
  });

  it('should change delete button text on first click and delete on second click', () => {
    const deleteButton = fixture.nativeElement.querySelector(
      '[data-testid="delete-button"]',
    );

    deleteButton.click();
    fixture.detectChanges();

    expect(deleteButton.textContent).toContain('Are you sure?');

    deleteButton.click();
    fixture.detectChanges();

    expect(habitServiceMock.removeHabit).toHaveBeenCalledWith('42');
  });
});
