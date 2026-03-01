import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="tickets-container">
      <div class="header-actions">
        <h2 class="glow-text">📋 Ticket Archive</h2>
        <div class="search-box">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name or ID..." class="input-search">
          <a routerLink="/dashboard" class="btn-back">⬅ Back</a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer & Hotel</th>
              <th>Trips</th>
              <th>Pax Summary</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ticket of filteredTickets()">
              <td><span class="ticket-id">#{{ticket.ticketNum}}</span></td>
              <td>
                <strong>{{ticket.customer?.name}}</strong><br>
                <small>🏨 {{ticket.customer?.hotel}} (Room: {{ticket.customer?.room}})</small>
              </td>
              <td>
                <div *ngFor="let act of ticket.activities" class="activity-row">
                  🚀 {{act.tour}} <small>({{act.date}})</small>
                </div>
              </td>
              <td>
                <div class="pax-badge">
                   A:{{getTotalPax(ticket, 'adults')}} | C:{{getTotalPax(ticket, 'children')}}
                </div>
              </td>
              <td class="price-cell">{{ticket.totalPrice}} {{ticket.currency}}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(ticket.payment?.status)">
                  {{ticket.payment?.status}}
                </span>
              </td>
              <td>
                <button (click)="deleteTicket(ticket.ticketNum)" class="btn-delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tickets-container { padding: 20px; background: #0f172a; min-height: 100vh; color: white; }
    .header-actions { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .input-search { background: #1e293b; border: 1px solid #334155; color: white; padding: 8px 15px; border-radius: 8px; width: 250px; }
    .table-responsive { background: #1e293b; border-radius: 12px; overflow: hidden; }
    .tickets-table { width: 100%; border-collapse: collapse; }
    .tickets-table th { background: #334155; padding: 12px; text-align: left; font-size: 14px; }
    .tickets-table td { padding: 12px; border-bottom: 1px solid #334155; font-size: 13px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .bg-paid { background: #059669; }
    .bg-deposit { background: #d97706; }
    .btn-delete { background: #dc2626; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
    .btn-back { color: #94a3b8; text-decoration: none; font-size: 14px; align-self: center; }
  `]
})
export class TicketsComponent implements OnInit {
  allTickets: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    const data = localStorage.getItem('bookings');
    this.allTickets = data ? JSON.parse(data).reverse() : [];
  }

  filteredTickets() {
    return this.allTickets.filter(t => 
      t.customer?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      t.ticketNum?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getTotalPax(ticket: any, type: string): number {
    return ticket.activities?.reduce((sum: number, act: any) => sum + (act[type] || 0), 0) || 0;
  }

  getStatusClass(status: string) {
    return status === 'All Paid' ? 'bg-paid' : 'bg-deposit';
  }

  deleteTicket(id: string) {
    if (confirm('Delete this ticket?')) {
      this.allTickets = this.allTickets.filter(t => t.ticketNum !== id);
      localStorage.setItem('bookings', JSON.stringify(this.allTickets));
    }
  }
}
