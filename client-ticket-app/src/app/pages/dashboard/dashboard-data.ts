import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardData {

  getBookings() {
    return [
      {
        id: 1,
        clientName: 'Ahmed Ali',
        phone: '+90 555 123 4567',
        hotel: 'Hilton Istanbul',
        room: '504',
        adults: 2,
        children: 1,
        infants: 0,
        date: '2026-01-22',
        time: '14:30'
      }
    ];
  }

  getTickets() {
    return [
      {
        id: 1,
        type: 'Museum Ticket',
        price: 50,
        commission: 10
      }
    ];
  }

  getTotalCommission() {
    return this.getTickets()
      .reduce((total, ticket) => total + ticket.commission, 0);
  }
}
