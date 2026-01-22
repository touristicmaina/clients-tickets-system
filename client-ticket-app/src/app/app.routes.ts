import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
