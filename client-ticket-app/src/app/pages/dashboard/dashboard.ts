import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardData } from './dashboard-data';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart';
import { DashboardKpiComponent } from './dashboard-kpi/dashboard-kpi';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardChartComponent,
    DashboardKpiComponent
  ],
  template: `
    <h2 class="page-title">Dashboard</h2>

    <!-- KPI ROW -->
    <div class="kpi-grid">
      <app-dashboard-kpi
        title="Total Bookings"
        [value]="bookings.length"
        icon="📅">
      </app-dashboard-kpi>

      <app-dashboard-kpi
        title="Tickets Sold"
        [value]="tickets.length"
        icon="🎟️">
      </app-dashboard-kpi>

      <app-dashboard-kpi
        title="Total Commission"
        [value]="totalCommission + ' $'"
        icon="💰">
      </app-dashboard-kpi>
    </div>

    <!-- CHART -->
    <app-dashboard-chart
      [bookings]="bookings.length"
      [tickets]="tickets.length">
    </app-dashboard-chart>

    <!-- LATEST BOOKINGS -->
    <div class="card">
      <h3>Latest Bookings</h3>
      <ul>
        <li *ngFor="let b of bookings">
          {{ b.clientName }} – {{ b.hotel }} – {{ b.date }} {{ b.time }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .page-title {
      margin-bottom: 20px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: #fff;
      padding: 20px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      margin-top: 30px;
    }

    ul {
      padding-left: 18px;
    }
  `]
})
export class DashboardPageComponent implements OnInit {

  bookings: any[] = [];
  tickets: any[] = [];
  totalCommission = 0;

  constructor(private dashboardData: DashboardData) {}

  ngOnInit(): void {
    this.bookings = this.dashboardData.getBookings();
    this.tickets = this.dashboardData.getTickets();
    this.totalCommission = this.dashboardData.getTotalCommission();
  }
}
