import { Routes } from '@angular/router';
import { AddPage } from './features/habits/add-page/add-page';
import { EditPage } from './features/habits/edit-page/edit-page';
import { HabitsPage } from './features/habits/habits-page/habits-page';

export const routes: Routes = [
  { path: '', component: HabitsPage },
  { path: 'add', component: AddPage },
  { path: 'edit/:id', component: EditPage },
];
