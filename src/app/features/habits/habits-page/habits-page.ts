import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HabitService } from '../../../core/services';
import { HabitCard, Header } from '../../../shared/components';
import { FormatDatePipe } from '../../../shared/pipes';

@Component({
  selector: 'app-habits-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    Header,
    FormatDatePipe,
    HabitCard,
    RouterLink,
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.scss',
})
export class HabitsPage {
  currentDate: Date = new Date();
  habitService = inject(HabitService);

  habits = this.habitService.getHabits();
}
