import { computed, DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { STORAGE_SETTINGS_KEY } from '../../data/storage-keys';
import type { Settings } from '../../models/settings.model';

const defaultSettings: Settings = {
  id: 'user-settings',
  theme: 'light',
  locale: 'en',
  notificationsEnabled: false,
};

function parseSettings(raw: string | null): Settings {
  if (!raw) {
    return { ...defaultSettings };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...parsed,
      id: 'user-settings',
    };
  } catch {
    return { ...defaultSettings };
  }
}

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly document = inject(DOCUMENT);

  private readonly _state = signal<Settings>(this.readFromStorage());

  readonly settings = this._state.asReadonly();

  readonly theme = computed(() => this._state().theme);
  readonly locale = computed(() => this._state().locale);
  readonly notificationsEnabled = computed(
    () => this._state().notificationsEnabled,
  );
  readonly reminderTime = computed(() => this._state().reminderTime);

  hydrateFromStorage(): void {
    this._state.set(this.readFromStorage());
    this.applyThemeToDom(this._state().theme);
  }

  setTheme(mode: 'light' | 'dark'): void {
    this._state.update((s) => ({ ...s, theme: mode }));
    this.applyThemeToDom(mode);
  }

  toggleTheme(): void {
    const next = this._state().theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setLocale(lang: 'en' | 'es'): void {
    this._state.update((s) => ({ ...s, locale: lang }));
  }

  setNotificationsEnabled(enabled: boolean): void {
    this._state.update((s) => ({ ...s, notificationsEnabled: enabled }));
  }

  setReminderTime(time: string | undefined): void {
    this._state.update((s) => ({ ...s, reminderTime: time }));
  }

  persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(this._state()));
  }

  private readFromStorage(): Settings {
    if (typeof localStorage === 'undefined') {
      return { ...defaultSettings };
    }
    return parseSettings(localStorage.getItem(STORAGE_SETTINGS_KEY));
  }

  private applyThemeToDom(theme: 'light' | 'dark'): void {
    const root = this.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }
}
