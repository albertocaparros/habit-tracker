import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HabitEntry } from '../../../core/models';
import { WeekdayIndicator } from './weekday-indicator';

describe('WeekdayIndicator', () => {
  let component: WeekdayIndicator;
  let fixture: ComponentFixture<WeekdayIndicator>;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-09-02'));

    const mockHabitEntries: HabitEntry[] = [
      { id: '1', habitId: 'habit-1', date: '2025-09-01', status: 'done' },
      { id: '2', habitId: 'habit-1', date: '2025-09-02', status: 'pending' },
      { id: '3', habitId: 'habit-1', date: '2025-09-03', status: 'pending' },
      { id: '4', habitId: 'habit-1', date: '2025-09-04', status: 'missed' },
      { id: '5', habitId: 'habit-1', date: '2025-09-05', status: 'done' },
      { id: '6', habitId: 'habit-1', date: '2025-09-06', status: 'done' },
      { id: '7', habitId: 'habit-1', date: '2025-09-07', status: 'missed' },
    ];

    await TestBed.configureTestingModule({
      imports: [WeekdayIndicator],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekdayIndicator);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('habitEntries', mockHabitEntries);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the weekday indicators', () => {
    const days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

    const weekdayElements = fixture.nativeElement.querySelectorAll(
      '[data-testid="weekday"]',
    );

    expect(weekdayElements.length).toBe(7);
    weekdayElements.forEach((element: HTMLElement, index: number) => {
      expect(element.textContent.trim()).toBe(days[index]);
    });
  });

  it('should update the weekday status based on habit entries', () => {
    const expectedStatus = [
      { day: 'M', status: 'done' },
      { day: 'T', status: 'pending' },
      { day: 'W', status: 'pending' },
      { day: 'Th', status: 'missed' },
      { day: 'F', status: 'done' },
      { day: 'Sa', status: 'done' },
      { day: 'Su', status: 'missed' },
    ];

    expectedStatus.forEach(({ day, status }) => {
      expect(component.weekdayStatus().get(day)).toBe(status);
    });
  });
});
