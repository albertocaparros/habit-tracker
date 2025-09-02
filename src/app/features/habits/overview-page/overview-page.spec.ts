import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DailyStats, HabitStats } from '../../../core/models';
import { StatsService } from '../../../core/services';
import { OverviewPage } from './overview-page';

describe('OverviewPage', () => {
  let component: OverviewPage;
  let fixture: ComponentFixture<OverviewPage>;
  let statsServiceMock: StatsService;
  const mockDailyStatsData: { [key: string]: DailyStats } = {
    '2025-08-21': { total: 5, completed: 0 },
    '2025-08-22': { total: 5, completed: 1 },
    '2025-08-23': { total: 5, completed: 2 },
    '2025-08-24': { total: 5, completed: 3 },
    '2025-08-25': { total: 5, completed: 4 },
    '2025-08-26': { total: 5, completed: 5 },
  };
  const mockHabitStats: HabitStats = {
    longestStreak: { days: 4, habitName: 'Reading' },
    mostClearedHabit: { habitName: 'Exercise', clearingPercentage: 60 },
    leastClearedHabit: { habitName: 'Cooking', clearingPercentage: 40 },
    completionRate: 50,
  };

  beforeEach(async () => {
    statsServiceMock = {
      getDailyStatsData: vi.fn().mockReturnValue(mockDailyStatsData),
      getHabitStats: vi.fn().mockReturnValue(mockHabitStats),
    } as unknown as StatsService;

    await TestBed.configureTestingModule({
      imports: [OverviewPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: StatsService, useValue: statsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load daily and stats data on init from the service', () => {
    component.ngOnInit();

    expect(statsServiceMock.getDailyStatsData).toHaveBeenCalled();
    expect(statsServiceMock.getHabitStats).toHaveBeenCalled();

    expect(component.dailyData).toBeDefined();
    expect(component.habitStats).toBeDefined();
  });

  it('should print all the habit stats in the template', () => {
    const longestStreak = fixture.nativeElement.querySelector(
      '[data-testid="longest-streak"]',
    );
    expect(longestStreak).toBeTruthy();
    expect(longestStreak.textContent).toContain(
      'Longest Streak: 4 days (Reading)',
    );

    const mostClearedHabit = fixture.nativeElement.querySelector(
      '[data-testid="most-cleared-habit"]',
    );
    expect(mostClearedHabit).toBeTruthy();
    expect(mostClearedHabit.textContent).toContain(
      'Most Cleared Habit: Exercise - 60.00%',
    );

    const leastClearedHabit = fixture.nativeElement.querySelector(
      '[data-testid="least-cleared-habit"]',
    );
    expect(leastClearedHabit).toBeTruthy();
    expect(leastClearedHabit.textContent).toContain(
      'Least Cleared Habit: Cooking - 40.00%',
    );

    const completionRate = fixture.nativeElement.querySelector(
      '[data-testid="completion-rate"]',
    );
    expect(completionRate).toBeTruthy();
    expect(completionRate.textContent).toContain('Completion Rate: 50.00%');
  });
});
