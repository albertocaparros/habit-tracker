import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Habit, HabitEntry } from '../../../core/models';
import { HabitEntryService } from '../../../core/services';
import { mockHabitEntries } from '../../../core/services/habit-entry/mock-habit-entries';
import { HabitCard } from './habit-card';

describe('HabitCard', () => {
  let component: HabitCard;
  let fixture: ComponentFixture<HabitCard>;
  let mockHabitEntryService: Partial<HabitEntryService>;

  beforeEach(async () => {
    mockHabitEntryService = {
      getEntriesForHabit: vi
        .fn()
        .mockReturnValue([
          ...mockHabitEntries.filter((entry) => entry.habitId === 'habit-1'),
        ]),
      switchStatus: vi.fn(),
      addEntry: vi.fn().mockImplementation((entry: HabitEntry) => {
        const newEntry: HabitEntry = {
          ...entry,
          id: 'new-id',
          date: new Date().toISOString().slice(0, 10),
        };

        return newEntry;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [HabitCard],
      providers: [
        provideZonelessChangeDetection(),
        { provide: HabitEntryService, useValue: mockHabitEntryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitCard);
    component = fixture.componentInstance;

    const habit: Habit = {
      id: 'habit-1',
      name: 'Daily Meditation',
      icon: 'self_improvement',
      description: '10 minutes of mindfulness',
      createdAt: '2025-08-01',
      archived: false,
    };

    fixture.componentRef.setInput('habit', habit);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute habit entries correctly', () => {
    const entries = component.habitEntries();

    expect(entries[0].habitId).toBe('habit-1');
    expect(entries.length).toBe(10);
  });

  it("should compute today's entry correctly", () => {
    const todayEntry = component.todayEntry();

    expect(todayEntry).toBeDefined();
    expect(todayEntry?.habitId).toBe('habit-1');
    expect(todayEntry?.date).toBe(new Date().toISOString().slice(0, 10));
  });

  it('should switch today status on click', () => {
    const todayEntry = component.todayEntry();
    expect(todayEntry?.status).toBe('pending');

    const statusElement = fixture.nativeElement.querySelector(
      '[data-testid="status"]',
    );
    statusElement.click();
    fixture.detectChanges();

    expect(mockHabitEntryService.switchStatus).toHaveBeenCalledWith(
      todayEntry?.id,
    );
  });

  it('should print the habit name', () => {
    const nameElement = fixture.nativeElement.querySelector('.text-lg');
    expect(nameElement.textContent).toContain('Daily Meditation');
  });

  it('should display the correct icon', () => {
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement.textContent).toContain('self_improvement');
  });

  it('should display the correct status icon', () => {
    const statusElement = fixture.nativeElement.querySelector(
      '[data-testid="status"]',
    );
    expect(statusElement.querySelector('mat-icon').textContent).toContain(
      'schedule',
    );
  });

  it('should display the current streak', () => {
    const streakDisplay =
      fixture.nativeElement.querySelector('app-streak-display');
    expect(streakDisplay).toBeTruthy();
    expect(streakDisplay.textContent).toContain('Streak:');
  });

  it('should display the weekday indicator', () => {
    const weekdayIndicator = fixture.nativeElement.querySelector(
      'app-weekday-indicator',
    );
    expect(weekdayIndicator).toBeTruthy();
  });
});
