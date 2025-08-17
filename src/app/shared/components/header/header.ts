import { Component, DOCUMENT, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatSlideToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly document = inject(DOCUMENT);

  toggleTheme() {
    if (this.document.documentElement.classList.contains('dark-mode')) {
      this.document.documentElement.classList.remove('dark-mode');
    } else {
      this.document.documentElement.classList.add('dark-mode');
    }
  }
}
