import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-page',
  imports: [
    MatButton,
    MatIcon,
    MatSlideToggle,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    TranslatePipe,
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  selectedLanguage = signal(this.translate.getCurrentLang());

  toggleTheme() {
    if (this.document.documentElement.classList.contains('dark-mode')) {
      this.document.documentElement.classList.remove('dark-mode');
    } else {
      this.document.documentElement.classList.add('dark-mode');
    }
  }

  changeLanguage(event: MatSelectChange) {
    this.translate.use(event.value);
  }
}
