import { Component, DOCUMENT, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-habits-page',
  imports: [
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.scss',
})
export class HabitsPage {
  private readonly document = inject(DOCUMENT);

  toggleTheme() {
    if (this.document.documentElement.classList.contains('dark-mode')) {
      this.document.documentElement.classList.remove('dark-mode');
    } else {
      this.document.documentElement.classList.add('dark-mode');
    }
  }
}
