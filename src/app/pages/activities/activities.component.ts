import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="act-container">
      <header class="flex-row">
        <button (click)="router.navigate(['/dashboard'])">BACK TO DASHBOARD</button>
        <button class="pdf-btn">DOWNLOAD PDF</button>
      </header>
      
      <div class="glass-card">
        <h2>ADD ACTIVITY (ADMIN ONLY)</h2>
        <div class="grid-inputs">
           <input [(ngModel)]="item.name" placeholder="TRIP NAME">
           <input [(ngModel)]="item.op" placeholder="OPERATOR">
           <input [(ngModel)]="item.reg" placeholder="REGION">
           <input [(ngModel)]="item.cost" type="number" placeholder="COST PRICE">
           <select [(ngModel)]="item.cur"><option>$</option><option>€</option><option>£</option><option>₺</option></select>
        </div>
        <button class="save-act" (click)="save()">SAVE ACTIVITY</button>
      </div>

      <table>
        <thead><tr><th>TRIP</th><th>OPERATOR</th><th>COST</th><th>ACTION</th></tr></thead>
        <tbody>
          <tr *ngFor="let a of list; let i = index">
            <td>{{a.name}}</td><td>{{a.op}}</td><td>{{a.cost}}{{a.cur}}</td>
            <td><button (click)="edit(i)">EDIT</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .act-container { padding: 40px; background: #020617; min-height: 100vh; color: white; }
    .grid-inputs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
    input, select { padding: 12px; background: #0f172a; border: 1px solid #1e293b; color: white; }
    .save-act { background: #10b981; width: 100%; margin-top: 20px; padding: 15px; color: white; border: none; font-weight: bold; }
    table { width: 100%; margin-top: 30px; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1e293b; }
  `]
})
export class ActivitiesComponent implements OnInit {
  list: any[] = [];
  item = { name: '', op: '', reg: '', cost: 0, cur: '$' };
  constructor(public router: Router) {}
  ngOnInit() { this.list = JSON.parse(localStorage.getItem('activities') || '[]'); }
  save() {
    this.list.push({...this.item});
    localStorage.setItem('activities', JSON.stringify(this.list));
    this.item = { name: '', op: '', reg: '', cost: 0, cur: '$' };
  }
  edit(i: number) { this.item = this.list[i]; this.list.splice(i,1); }
}
