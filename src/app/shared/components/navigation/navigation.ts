import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, MatIcon, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  activeClasses: string[] = [
    'scale-110',
    'translate-y-[-1px]',
    'text-shadow-md',
    'text-(--mat-sys-on-surface-variant)',
  ];
}
