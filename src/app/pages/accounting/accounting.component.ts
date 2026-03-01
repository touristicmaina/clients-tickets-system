import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="acc-wrapper">
      <header class="top-bar">
        <button (click)="router.navigate(['/dashboard'])">← BACK</button>
        <h1>FINANCIAL ACCOUNTING</h1>
      </header>

      <div class="guide-grid" *ngIf="!selectedGuide">
        <div class="glass-card guide-card" *ngFor="let g of guides" (click)="selectGuide(g)">
          <div class="glow-border"></div>
          <h3>{{ g.name }}</h3>
          <p>Pending Wallet: <span class="amt">{{ g.wallet }}$</span></p>
          <button class="view-btn">Open Profile</button>
        </div>
      </div>

      <div class="reset-page glass-card" *ngIf="selectedGuide">
        <button class="back-mini" (click)="selectedGuide = null">Close Profile</button>
        <h2>{{ selectedGuide.name }} - Wallet Reset</h2>
        
        <div class="stats-box">
          <div class="s-row"><span>Reset Date:</span> <span>{{ today | date:'medium' }}</span></div>
          <div class="s-row"><span>Total Sales:</span> <span>{{ selectedGuide.sales }}$</span></div>
          <div class="s-row highlight"><span>Commission (40%):</span> <span>{{ selectedGuide.wallet }}$</span></div>
        </div>

        <div class="action-area">
          <p class="warning">⚠️ Account cannot be reset without guide's presence.</p>
          <button class="reset-btn" (click)="resetWallet()">CLEAR WALLET & LOG TRANSACTION</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .acc-wrapper { background: #020617; min-height: 100vh; padding: 40px; color: white; }
    .guide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .guide-card { position: relative; padding: 25px; text-align: center; cursor: pointer; border: 1px solid #1e293b; transition: 0.3s; }
    .guide-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
    .glow-border { position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: #f59e0b; box-shadow: 0 0 15px #f59e0b; }
    .amt { color: #10b981; font-weight: bold; }
    
    .reset-page { max-width: 600px; margin: auto; padding: 40px; border: 1px solid #3b82f6; }
    .stats-box { background: #0f172a; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .s-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1e293b; }
    .highlight { color: #10b981; font-size: 20px; font-weight: bold; }
    .reset-btn { width: 100%; background: #ef4444; color: white; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .warning { color: #94a3b8; font-size: 12px; text-align: center; }
  `]
})
export class AccountingComponent {
  today = new Date();
  selectedGuide: any = null;
  guides = [
    { name: 'Ahmed Guide', wallet: 450, sales: 1125 },
    { name: 'Mehmet Guide', wallet: 320, sales: 800 }
  ];

  constructor(public router: Router) {}

  selectGuide(g: any) { this.selectedGuide = g; }
  resetWallet() {
    alert("Wallet Cleared! Transaction logged for " + this.selectedGuide.name);
    this.selectedGuide.wallet = 0;
    this.selectedGuide = null;
  }
}
