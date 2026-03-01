import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsArrivalsComponent } from './pages/clients-arrivals/clients-arrivals.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'arrivals', component: ClientsArrivalsComponent },
  { path: '**', redirectTo: 'login' }
];
