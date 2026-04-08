import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SettingsStore } from '../../../core/stores/settings/settings.store';

@Component({
  selector: 'app-settings-page',
  imports: [
    MatButtonModule,
    MatIcon,
    MatSlideToggle,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatSnackBarModule,
    TranslatePipe,
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly translate = inject(TranslateService);
  private readonly snackBar = inject(MatSnackBar);
  readonly settingsStore = inject(SettingsStore);

  async requestNotificationPermission(): Promise<void> {
    if (typeof Notification === 'undefined') {
      return;
    }
    await Notification.requestPermission();
  }

  onThemeToggle(checked: boolean): void {
    this.settingsStore.setTheme(checked ? 'dark' : 'light');
  }

  changeLanguage(event: MatSelectChange): void {
    const lang = event.value as 'en' | 'es';
    this.settingsStore.setLocale(lang);
    this.translate.use(lang);
  }

  onNotificationsToggle(enabled: boolean): void {
    this.settingsStore.setNotificationsEnabled(enabled);
    if (enabled) {
      void this.requestNotificationPermission();
    }
  }

  onReminderTimeChange(value: string): void {
    this.settingsStore.setReminderTime(value || undefined);
  }

  save(): void {
    this.settingsStore.persist();
    this.snackBar.open(this.translate.instant('settings.saved'), undefined, {
      duration: 2500,
    });
  }
}
