import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Teams } from './components/teams/teams';
import { authGuard } from './core/guards/auth.guard';
import { Projects } from './components/projects/projects';
import { Tasks } from './components/tasks/tasks';
import { AllTasks } from './components/all-tasks/all-tasks';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'teams', component: Teams, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
  { path: 'projects/:id', component: Tasks, canActivate: [authGuard] },
   { path: 'all-tasks', component: AllTasks, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
