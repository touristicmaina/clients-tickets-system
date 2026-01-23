import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Statistics</h3>

    <div class="chart">
      <div class="bar">
        <span>Bookings</span>
        <div class="value" [style.width.%]="bookings * 20"></div>
        <strong>{{ bookings }}</strong>
      </div>

      <div class="bar">
        <span>Tickets</span>
        <div class="value tickets" [style.width.%]="tickets * 20"></div>
        <strong>{{ tickets }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .chart { margin-top: 20px; }
    .bar { margin-bottom: 15px; }
    .bar span { display:block; font-size:14px; margin-bottom:4px; }
    .value {
      height: 12px;
      background: #667eea;
      border-radius: 6px;
    }
    .tickets { background: #f59e0b; }
  `]
})
export class DashboardChartComponent {
  @Input() bookings = 0;
  @Input() tickets = 0;
}
