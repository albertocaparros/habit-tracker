import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SettingsStore } from './core/stores/settings/settings.store';
import { Navigation } from './shared/components/navigation/navigation';
import { SwUpdatePrompt } from './shared/components/sw-update-prompt/sw-update-prompt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, Navigation, SwUpdatePrompt],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('Habit Tracker');

  private readonly translate = inject(TranslateService);
  private readonly matIconReg = inject(MatIconRegistry);
  private readonly settingsStore = inject(SettingsStore);

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this.translate.addLangs(['en', 'es']);
    this.translate.setFallbackLang('en');
    this.translate.use(this.settingsStore.locale());
  }
}
