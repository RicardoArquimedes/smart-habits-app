import { Routes } from '@angular/router';
import { HabitsPageComponent } from './features/habits/pages/habits-page/habits-page.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { authGuard } from '../core/guards/auth-guard/auth.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HabitsPageComponent,
    canActivate: [authGuard], // ← OBLIGATORIO
  },
];
