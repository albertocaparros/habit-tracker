import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { DailyStats } from '../../../core/models';

@Component({
  selector: 'app-calendar-heatmap',
  imports: [MatIcon, NgClass],
  templateUrl: './calendar-heatmap.html',
  styleUrl: './calendar-heatmap.scss',
})
export class CalendarHeatmap {
  @Input() currentDate = new Date();
  @Input() dailyData: { [key: string]: DailyStats } = {};

  weeks: Date[][] = [];
  readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  ngOnInit() {
    this.generateCalendar(this.selectedMonth, this.selectedYear);
  }

  onMonthChange() {
    this.generateCalendar(this.selectedMonth, this.selectedYear);
  }

  prevMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
  }

  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
  }

  generateCalendar(month: number, year: number) {
    const baseDate = new Date(year, month, 1);
    const start = startOfWeek(startOfMonth(baseDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(baseDate), { weekStartsOn: 1 });

    const weeks: Date[][] = [];
    const date = new Date(start);

    while (date <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(addDays(date, i));
      }
      weeks.push(week);
      date.setDate(date.getDate() + 7);
    }

    this.weeks = weeks;
  }

  getDayKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  isSelectedMonth(date1: Date): boolean {
    return isSameMonth(date1, new Date(this.selectedYear, this.selectedMonth));
  }

  isCurrentDay(date1: Date): boolean {
    return isSameDay(date1, new Date());
  }

  getHeatmapColor(day: Date): string {
    const key = this.getDayKey(day);
    const data = this.dailyData[key];

    if (!data || data.total === 0) return 'bg-gray-300 dark:bg-gray-800';

    const completionRatio = data.completed / data.total;

    if (completionRatio === 0) {
      return 'bg-red-300 dark:bg-red-800';
    } else if (completionRatio <= 0.25) {
      return 'bg-orange-300 dark:bg-orange-800';
    } else if (completionRatio <= 0.5) {
      return 'bg-amber-300 dark:bg-amber-800';
    } else if (completionRatio <= 0.75) {
      return 'bg-yellow-300 dark:bg-yellow-800';
    } else if (completionRatio < 1) {
      return 'bg-lime-300 dark:bg-lime-800';
    } else if (completionRatio === 1) {
      return 'bg-green-400 dark:bg-green-800';
    } else {
      return 'bg-gray-300 dark:bg-gray-800';
    }
  }
}
