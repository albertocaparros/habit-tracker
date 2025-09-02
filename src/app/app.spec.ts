import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSlideToggleModule],
      providers: [
        MatIconRegistry,
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
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
