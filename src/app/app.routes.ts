import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/habits/habits-page/habits-page').then(
        (m) => m.HabitsPage,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./features/habits/add-page/add-page').then((m) => m.AddPage),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./features/habits/edit-page/edit-page').then((m) => m.EditPage),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./features/habits/overview-page/overview-page').then(
        (m) => m.OverviewPage,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings-page/settings-page').then(
        (m) => m.SettingsPage,
      ),
  },
];
