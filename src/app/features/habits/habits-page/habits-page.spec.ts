import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { HabitService } from '../../../core/services';
import { mockHabits } from '../../../core/services/habit/mock-habits';
import { FormatDatePipe } from '../../../shared/pipes';
import { HabitsPage } from './habits-page';

describe('HabitsPage', () => {
  let fixture: ComponentFixture<HabitsPage>;
  const formatDatePipe = new FormatDatePipe();
  const habitsSignal = signal(mockHabits);
  let habitServiceMock: HabitService;

  beforeEach(() => {
    habitServiceMock = {
      getHabits: vi.fn().mockReturnValue(habitsSignal),
      addHabit: vi.fn(),
      getHabitById: vi.fn(),
    } as unknown as HabitService;

    TestBed.configureTestingModule({
      imports: [MatIconModule, MatSlideToggleModule],
      providers: [
        { provide: DOCUMENT, useValue: globalThis.document },
        { provide: HabitService, useValue: habitServiceMock },
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsPage);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have a currentDate initialized to today', () => {
    expect(fixture.componentInstance.currentDate).toBeInstanceOf(Date);
    expect(fixture.componentInstance.currentDate.toDateString()).toBe(
      new Date().toDateString(),
    );
  });

  it('should print the current date in the template', () => {
    const dateElement = fixture.nativeElement.querySelector('p');
    const pipedDate = formatDatePipe.transform(
      fixture.componentInstance.currentDate,
    );

    expect(dateElement.textContent).toContain(pipedDate);
  });

  it('should render the header component', () => {
    const headerElement = fixture.nativeElement.querySelector('app-header');
    expect(headerElement).toBeTruthy();
  });

  it('should print the empty state when no habits are present', () => {
    habitsSignal.set([]);
    fixture.detectChanges();

    const emptyStateElement = fixture.debugElement.query(
      By.css('[data-testid="empty-state"]'),
    );

    expect(emptyStateElement).toBeTruthy();
    expect(emptyStateElement.nativeElement.textContent).toContain(
      'Nothing for today!',
    );
    expect(emptyStateElement.nativeElement.textContent).toContain(
      'Rest is part of the process. See you tomorrow!',
    );
  });

  it('should print the habits when they are present', () => {
    habitsSignal.set(mockHabits);
    fixture.detectChanges();

    const habitCards = fixture.debugElement.queryAll(By.css('app-habit-card'));
    expect(habitCards.length).toBe(mockHabits.length);

    habitCards.forEach((card, index) => {
      const habit = mockHabits[index];
      expect(card.nativeElement.textContent).toContain(habit.name);
      expect(
        card.nativeElement.querySelector('app-weekday-indicator'),
      ).toBeTruthy();
      expect(
        card.nativeElement.querySelector('app-streak-display'),
      ).toBeTruthy();
    });
  });

  it('should contain a button to add a new habit and redirect to add habit page', async () => {
    const addButton = fixture.debugElement.query(
      By.css('[data-testid="new-habit-button"]'),
    ).nativeElement;

    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toContain('New habit');
    expect(addButton.getAttribute('routerLink')).toBe('/add');
  });
});
