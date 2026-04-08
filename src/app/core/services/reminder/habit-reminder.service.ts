import { Injectable, inject } from '@angular/core';
import { SettingsStore } from '../../stores/settings/settings.store';

/**
 * Local reminders via the Notification API.
 * Background scheduling is limited without a dedicated worker strategy; this is a simple implementation for a portfolio project.
 */
@Injectable({ providedIn: 'root' })
export class HabitReminderService {
  private readonly settings = inject(SettingsStore);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastFireKey: string | null = null;

  /** Poll once per minute; aligns with minute-level reminderTime. */
  start(): void {
    if (this.intervalId !== null || typeof window === 'undefined') {
      return;
    }
    this.intervalId = window.setInterval(() => this.tick(), 60_000);
    this.tick();
  }

  private tick(): void {
    if (!this.settings.notificationsEnabled()) {
      return;
    }
    if (typeof Notification === 'undefined') {
      return;
    }
    if (Notification.permission !== 'granted') {
      return;
    }

    const reminder = this.settings.reminderTime();
    if (!reminder) {
      return;
    }

    const parts = reminder.split(':').map(Number);
    const hh = parts[0];
    const mm = parts[1];
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      return;
    }

    const now = new Date();
    if (now.getHours() !== hh || now.getMinutes() !== mm) {
      return;
    }

    const key = `${now.toDateString()}T${hh}:${mm}`;
    if (this.lastFireKey === key) {
      return;
    }
    this.lastFireKey = key;

    new Notification('Habit Tracker', {
      body: 'Time to check in on your habits.',
      tag: 'habit-reminder',
    });
  }
}
