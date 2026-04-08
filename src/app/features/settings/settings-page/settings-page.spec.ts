import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsStore } from '../../../core/stores/settings/settings.store';
import { SettingsPage } from './settings-page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingsPage, TranslateModule.forRoot()],
      providers: [
        SettingsStore,
        provideZonelessChangeDetection(),
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set dark mode class via store', () => {
    document.documentElement.classList.remove('dark-mode');
    fixture.componentInstance.onThemeToggle(true);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);

    fixture.componentInstance.onThemeToggle(false);
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
    expect(fixture.componentInstance.settingsStore.locale()).toBe('es');
  });
});
