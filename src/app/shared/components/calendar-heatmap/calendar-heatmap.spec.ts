import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DailyStats } from '../../../core/models';
import { CalendarHeatmap } from './calendar-heatmap';

describe('CalendarHeatmap', () => {
  let component: CalendarHeatmap;
  let fixture: ComponentFixture<CalendarHeatmap>;
  const mockDailyData: { [key: string]: DailyStats } = {
    '2025-08-21': { total: 5, completed: 0 },
    '2025-08-22': { total: 5, completed: 1 },
    '2025-08-23': { total: 5, completed: 2 },
    '2025-08-24': { total: 5, completed: 3 },
    '2025-08-25': { total: 5, completed: 4 },
    '2025-08-26': { total: 5, completed: 5 },
  };
  const mockCurrentDate = new Date('2025-08-27');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHeatmap],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarHeatmap);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('dailyData', mockDailyData);
    fixture.componentRef.setInput('currentDate', mockCurrentDate);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate calendar weeks on init', () => {
    const weeks = component.weeks;
    expect(weeks).toBeTruthy();
    expect(weeks.length).toBeGreaterThan(0);
  });

  it('should navigate to previous month correctly', () => {
    const initialMonth = component.selectedMonth;

    component.prevMonth();
    expect(component.selectedMonth).toBe(initialMonth - 1);
  });

  it('should navigate to previous month correctly between years', () => {
    component.selectedMonth = 0;
    component.selectedYear = 2025;

    component.prevMonth();
    expect(component.selectedMonth).toBe(11);
    expect(component.selectedYear).toBe(2024);
  });

  it('should navigate to next month correctly', () => {
    const initialMonth = component.selectedMonth;
    component.nextMonth();
    expect(component.selectedMonth).toBe(initialMonth + 1);
  });

  it('should navigate to next month correctly between years', () => {
    component.selectedMonth = 11;
    component.selectedYear = 2024;

    component.nextMonth();
    expect(component.selectedMonth).toBe(0);
    expect(component.selectedYear).toBe(2025);
  });

  it('should return correct heatmap color for completion ratio', () => {
    let color = component.getHeatmapColor(new Date('2025-08-21'));
    expect(color).toEqual('bg-red-300 dark:bg-red-800');

    color = component.getHeatmapColor(new Date('2025-08-22'));
    expect(color).toEqual('bg-orange-300 dark:bg-orange-800');

    color = component.getHeatmapColor(new Date('2025-08-23'));
    expect(color).toEqual('bg-amber-300 dark:bg-amber-800');

    color = component.getHeatmapColor(new Date('2025-08-24'));
    expect(color).toEqual('bg-yellow-300 dark:bg-yellow-800');

    color = component.getHeatmapColor(new Date('2025-08-25'));
    expect(color).toEqual('bg-lime-300 dark:bg-lime-800');

    color = component.getHeatmapColor(new Date('2025-08-26'));
    expect(color).toEqual('bg-green-400 dark:bg-green-800');

    color = component.getHeatmapColor(new Date('2025-08-27'));
    expect(color).toEqual('bg-gray-300 dark:bg-gray-800');
  });

  it('should render correct month and year', () => {
    const currentMonthElement: HTMLElement =
      fixture.nativeElement.querySelector('[data-testid="current-month"]');
    const months = component.months;

    expect(currentMonthElement.textContent).toContain(
      months[new Date().getMonth()] + ' ' + new Date().getFullYear(),
    );
  });
});
