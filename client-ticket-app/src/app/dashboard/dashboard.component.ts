import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 style="text-align:center;margin-top:40px">
      ✅ Dashboard Works
    </h1>
  `
})
export class DashboardComponent {}
