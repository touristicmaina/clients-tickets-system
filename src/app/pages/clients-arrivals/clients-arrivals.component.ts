import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clients-arrivals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="app-container">
      <header class="navbar">
        <div class="logo">CTS AI MASTER - ARRIVALS</div>
        <button routerLink="/dashboard" class="btn-primary">🔙 Back to Dashboard</button>
      </header>

      <main class="content">
        <div class="view-box">
          <div class="card-arrival glow-border">
            <h3 class="glow-txt">✨ Entry New Arrival</h3>
            <div class="form-card">
              <label>CLIENT NAME</label>
              <input type="text" [(ngModel)]="entry.clientName" placeholder="👤 Full Name">
              
              <div class="row">
                <div><label>HOTEL</label><input type="text" [(ngModel)]="entry.hotel" placeholder="🏨 Hotel"></div>
                <div><label>FLIGHT NO</label><input type="text" [(ngModel)]="entry.flightNumber" placeholder="✈️ Flight"></div>
              </div>
              
              <label>ARRIVAL DATE</label>
              <input type="date" [(ngModel)]="entry.date">
              
              <div class="pax-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                <div><label>ADULT</label><input type="number" [(ngModel)]="entry.adults"></div>
                <div><label>CHILD</label><input type="number" [(ngModel)]="entry.children"></div>
                <div><label>INFANT</label><input type="number" [(ngModel)]="entry.infants"></div>
              </div>
              
              <div style="display:flex; gap:10px;">
                <button (click)="saveEntry()" class="save-btn" style="flex:2">💾 SAVE ENTRY</button>
                <button *ngIf="isEditing" (click)="cancelEdit()" class="btn-re" style="background:#ef4444">CANCEL</button>
              </div>
            </div>
          </div>

          <div class="card-arrival" style="margin-top:20px;">
            <h3 class="glow-txt">📥 Report Settings</h3>
            <div class="row">
               <input type="date" [(ngModel)]="reportStartDate">
               <button (click)="downloadReport()" class="btn-re" style="background:#3b82f6">📄 GET REPORT</button>
            </div>
          </div>
        </div>

        <div class="view-box full-w" style="margin-top:30px;">
          <h3 class="glow-txt">📋 Arrivals Table</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Day / Date</th>
                  <th>Client Name</th>
                  <th>Hotel</th>
                  <th>Flight</th>
                  <th>Pax</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of arrivalsList; let i = index">
                  <td>{{getDayName(item.date)}}<br><small>{{item.date}}</small></td>
                  <td><b>{{item.clientName}}</b></td>
                  <td>{{item.hotel}}</td>
                  <td><span class="flight-badge">{{item.flightNumber}}</span></td>
                  <td>A:{{item.adults}} C:{{item.children}} I:{{item.infants}}</td>
                  <td>
                    <button (click)="editEntry(i)" class="btn-re" style="margin-right:5px">✏️</button>
                    <button (click)="deleteEntry(i)" class="btn-re" style="background:#ef4444">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; background: #0f172a; color: white; font-family: 'Segoe UI', sans-serif; }
    .navbar { height: 60px; background: #1e293b; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 2px solid #10b981; }
    .logo { font-weight: 900; color: #10b981; }
    .content { padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
    .view-box { width: 100%; max-width: 600px; }
    .view-box.full-w { max-width: 1000px; }
    .form-card { background: #1e293b; padding: 20px; border-radius: 12px; }
    .glow-txt { color: #10b981; text-shadow: 0 0 5px rgba(16, 185, 129, 0.3); margin-bottom: 15px; }
    input { width: 100%; padding: 10px; margin-bottom: 10px; background: #0f172a; border: 1px solid #334155; color: white; border-radius: 6px; box-sizing: border-box; }
    label { font-size: 0.7rem; color: #10b981; font-weight: bold; display: block; margin-bottom: 4px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .save-btn { width: 100%; background: #10b981; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; }
    .btn-primary { background: #10b981; color: black; font-weight: bold; padding: 8px 15px; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; }
    .btn-re { color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; background: #334155; }
    .table-container { background: #1e293b; border-radius: 12px; overflow-x: auto; width: 100%; }
    table { width: 100%; border-collapse: collapse; }
    th { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .flight-badge { background: #3b82f6; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
  `]
})
export class ClientsArrivalsComponent implements OnInit {
  arrivalsList: any[] = [];
  entry = { clientName: '', hotel: '', flightNumber: '', date: '', adults: 0, children: 0, infants: 0 };
  isEditing = false;
  editIndex: number | null = null;
  reportStartDate = new Date().toISOString().split('T')[0];

  ngOnInit() {
    const saved = localStorage.getItem('clients_arrivals');
    this.arrivalsList = saved ? JSON.parse(saved) : [];
  }

  saveEntry() {
    if (!this.entry.clientName || !this.entry.date) return alert("Required: Name & Date");
    if (this.isEditing && this.editIndex !== null) {
      this.arrivalsList[this.editIndex] = { ...this.entry };
      this.isEditing = false;
      this.editIndex = null;
    } else {
      this.arrivalsList.unshift({ ...this.entry });
    }
    this.persist();
    this.resetForm();
  }

  editEntry(index: number) {
    this.isEditing = true;
    this.editIndex = index;
    this.entry = { ...this.arrivalsList[index] };
  }

  deleteEntry(index: number) {
    if (confirm("Delete this arrival?")) {
      this.arrivalsList.splice(index, 1);
      this.persist();
    }
  }

  cancelEdit() {
    this.isEditing = false; this.editIndex = null; this.resetForm();
  }

  persist() { localStorage.setItem('clients_arrivals', JSON.stringify(this.arrivalsList)); }
  resetForm() { this.entry = { clientName: '', hotel: '', flightNumber: '', date: '', adults: 0, children: 0, infants: 0 }; }

  getDayName(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  }

  downloadReport() {
    const filtered = this.arrivalsList.filter(a => a.date >= this.reportStartDate);
    if (filtered.length === 0) return alert("No data for these dates.");
    let content = `CTS AI MASTER - ARRIVALS REPORT\nPeriod: ${this.reportStartDate} to Today\n\n`;
    filtered.forEach(item => {
      content += `[${item.date}] ${this.getDayName(item.date).toUpperCase()}\n`;
      content += `Client: ${item.clientName} | Hotel: ${item.hotel}\n`;
      content += `Flight: ${item.flightNumber} | Pax: A:${item.adults} C:${item.children} I:${item.infants}\n`;
      content += `------------------------------------------\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arrivals_${this.reportStartDate}.txt`;
    a.click();
  }
}
