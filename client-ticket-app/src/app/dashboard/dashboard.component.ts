import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Dashboard</h1>
  `
})
export class DashboardComponent {
  constructor(private router: Router) {}

  }
