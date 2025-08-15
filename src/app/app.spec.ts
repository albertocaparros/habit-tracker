import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterOutlet, MatSlideToggleModule],
      providers: [MatIconRegistry, provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set default icon font class on init', () => {
    const iconRegistry = TestBed.inject(MatIconRegistry);
    const spy = vi.spyOn(iconRegistry, 'setDefaultFontSetClass');

    fixture.componentInstance.ngOnInit();

    expect(spy).toHaveBeenCalledWith('material-symbols-outlined');
  });
});
