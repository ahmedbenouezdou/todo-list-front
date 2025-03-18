import { Routes } from '@angular/router';
import {TASKS_ROUTES} from './tasks/tasks.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  ...TASKS_ROUTES
];
