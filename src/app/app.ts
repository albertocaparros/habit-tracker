import { Component, inject, signal } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './shared/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, Navigation],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Habit Tracker');
  matIconReg = inject(MatIconRegistry);

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
