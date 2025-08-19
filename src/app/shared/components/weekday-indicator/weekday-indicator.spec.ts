import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeekdayIndicator } from './weekday-indicator';

describe('WeekdayIndicator', () => {
  let component: WeekdayIndicator;
  let fixture: ComponentFixture<WeekdayIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekdayIndicator],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekdayIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
