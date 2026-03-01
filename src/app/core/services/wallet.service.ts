import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private sales: any[] = JSON.parse(localStorage.getItem('sales_v5') || '[]');
  private history: any[] = JSON.parse(localStorage.getItem('reset_history_v5') || '[]');

  addFinalBooking(booking: any) {
    this.sales.push({ ...booking, timestamp: new Date() });
    this.save();
  }

  getTotals() {
    return this.sales.reduce((acc: any, s) => {
      acc[s.currency] = (acc[s.currency] || 0) + s.totalPrice;
      return acc;
    }, { '$': 0, '€': 0, '£': 0, '₺': 0 });
  }

  getAdminStats() {
    return this.sales.reduce((acc: any, s) => {
      acc.totalSell += s.totalPrice;
      acc.totalCost += s.totalCost;
      acc.totalComm += (s.totalPrice - s.totalCost) * 0.4;
      acc.companyProfit += (s.totalPrice - s.totalCost) * 0.6;
      return acc;
    }, { totalSell: 0, totalCost: 0, totalComm: 0, companyProfit: 0 });
  }

  resetWallet() {
    const stats = this.getAdminStats();
    this.history.unshift({ ...stats, date: new Date().toLocaleString() });
    this.sales = [];
    this.save();
    localStorage.setItem('reset_history_v5', JSON.stringify(this.history));
  }

  private save() { localStorage.setItem('sales_v5', JSON.stringify(this.sales)); }
  getResetHistory() { return this.history; }
}
