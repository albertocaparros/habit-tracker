import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HabitEntry } from '../../../core/models';
import { StreakDisplay } from './streak-display';

describe('StreakDisplay', () => {
  let component: StreakDisplay;
  let fixture: ComponentFixture<StreakDisplay>;
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const testHabitEntries: HabitEntry[] = [
    {
      id: 'habit-2',
      habitId: 'habit-1',
      date: today.toISOString().slice(0, 10), // today
      status: 'done',
    },
    {
      id: 'habit-1',
      habitId: 'habit-1',
      date: yesterday.toISOString().slice(0, 10), // yesterday
      status: 'done',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakDisplay],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StreakDisplay);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate current streak correctly', () => {
    fixture.componentRef.setInput('habitEntries', testHabitEntries);
    fixture.detectChanges();

    expect(component.currentStreak()).toBe(2);
  });

  it('should return 0 for empty habitEntries', () => {
    fixture.componentRef.setInput('habitEntries', []);
    fixture.detectChanges();

    expect(component.currentStreak()).toBe(0);
  });

  it('should return 1 for non-consecutive streak', () => {
    const entriesWithGap: HabitEntry[] = [
      {
        date: today.toISOString().slice(0, 10),
        status: 'done',
        id: '1',
        habitId: 'h1',
      },
      {
        date: new Date(today.getTime() - 2 * 86400000)
          .toISOString()
          .slice(0, 10),
        status: 'done',
        id: '2',
        habitId: 'h1',
      },
    ];
    fixture.componentRef.setInput('habitEntries', entriesWithGap);
    fixture.detectChanges();

    expect(component.currentStreak()).toBe(1);
  });

  it('should return 0 for entries not marked as done', () => {
    const incompleteEntries: HabitEntry[] = [
      {
        date: today.toISOString().slice(0, 10),
        status: 'missed',
        id: '1',
        habitId: 'h1',
      },
    ];
    fixture.componentRef.setInput('habitEntries', incompleteEntries);
    fixture.detectChanges();
    expect(component.currentStreak()).toBe(0);
  });

  it('should render streak value in template', () => {
    const streakText = fixture.nativeElement.querySelector(
      '[data-testid="streak-value"]',
    );
    fixture.componentRef.setInput('habitEntries', testHabitEntries);
    fixture.detectChanges();

    expect(streakText.textContent).toContain('Streak: 2');
  });
});
