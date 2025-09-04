import { Component, inject, signal } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Navigation } from './shared/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, Navigation],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Habit Tracker');

  private readonly translate = inject(TranslateService);
  private readonly matIconReg = inject(MatIconRegistry);

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this.translate.addLangs(['en', 'es']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
}
