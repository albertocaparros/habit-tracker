import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreakDisplay } from './streak-display';

describe('StreakDisplay', () => {
  let component: StreakDisplay;
  let fixture: ComponentFixture<StreakDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakDisplay],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StreakDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
