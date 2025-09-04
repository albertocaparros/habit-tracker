import { Routes } from '@angular/router';
import { AddPage } from './features/habits/add-page/add-page';
import { EditPage } from './features/habits/edit-page/edit-page';
import { HabitsPage } from './features/habits/habits-page/habits-page';
import { OverviewPage } from './features/habits/overview-page/overview-page';
import { SettingsPage } from './features/settings/settings-page/settings-page';

export const routes: Routes = [
  { path: '', component: HabitsPage },
  { path: 'add', component: AddPage },
  { path: 'edit/:id', component: EditPage },
  { path: 'overview', component: OverviewPage },
  { path: 'settings', component: SettingsPage },
];
