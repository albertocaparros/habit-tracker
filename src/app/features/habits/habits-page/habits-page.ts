import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../../shared/components/header/header';
import { FormatDatePipe } from '../../../shared/pipes';

@Component({
  selector: 'app-habits-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    Header,
    FormatDatePipe,
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.scss',
})
export class HabitsPage {
  currentDate: Date = new Date();
}
