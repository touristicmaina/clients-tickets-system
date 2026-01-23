import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../pages/dashboard/dashboard-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
