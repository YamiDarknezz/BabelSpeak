import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  // 🔹 Rutas de Dashboard
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: 'translator',
        loadComponent: () =>
          import('./features/dashboard/modules/translator/translator').then(
            (m) => m.Translator
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./features/dashboard/modules/history/history').then(
            (m) => m.History
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'translator' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
