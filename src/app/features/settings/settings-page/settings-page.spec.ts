import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsPage } from './settings-page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPage, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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

  it('should change language', () => {
    const translate = fixture.componentInstance['translate'];
    vi.spyOn(translate, 'use');

    fixture.componentInstance.changeLanguage({
      value: 'es',
    } as MatSelectChange);

    expect(translate.use).toHaveBeenCalledWith('es');
    expect(fixture.componentInstance['translate'].getCurrentLang()).toBe('es');
  });
});
