import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'activities',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./view/pages/activities/activities.module')
        .then(m => m.ActivitiesModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
