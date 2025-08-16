import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { beforeEach, describe, expect, it } from 'vitest';
import { HabitsPage } from './habits-page';

describe('HabitsPage', () => {
  let fixture: ComponentFixture<HabitsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatSlideToggleModule],
      providers: [
        { provide: DOCUMENT, useValue: globalThis.document },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsPage);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle dark mode class', () => {
    document.documentElement.classList.remove('dark-mode');
    fixture.componentInstance.toggleTheme();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);

    fixture.componentInstance.toggleTheme();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(
      false,
    );
  });
});
