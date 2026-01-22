import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.LoginComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./pages/clients/clients-list/clients-list').then(m => m.ClientsListComponent)
      },
      {
        path: 'clients/create',
        loadComponent: () =>
          import('./pages/clients/create-client/create-client').then(m => m.CreateClientComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
