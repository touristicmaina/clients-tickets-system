import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { auth, db } from '../../firebase-integration';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, onSnapshot, query, where, deleteDoc, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container" [class.nav-open]="isNav">
      <header class="navbar">
        <button class="menu-btn" (click)="isNav = !isNav"><span></span><span></span><span></span></button>
        <div class="logo">CTS AI MASTER</div>
        <div class="user-badge">{{currentUserEmail}} ({{userRole}})</div>
      </header>

      <aside class="drawer">
        <nav class="links">
          <button (click)="setTab('wallet'); " [class.active]="tab==='wallet'">📊 Wallet Dashboard</button>
          <button *ngIf="userRole === 'admin'" (click)="setTab('users'); " [class.active]="tab==='users'">👥 Users Control</button>
          <button (click)="setTab('activities'); " [class.active]="tab==='activities'">🎯 Manage Activities</button>
          <button (click)="setTab('statement'); " [class.active]="tab==='statement'">📜 Account Statement</button>
          <button (click)="openForm()" class="btn-primary">+ New Client Ticket</button>
          <button (click)="setTab('history'); " [class.active]="tab==='history'">📋 Saved Clients</button>
          <button (click)="setTab('arrivals'); " [class.active]="tab==='arrivals'">🛬 Arrivals Plan</button>
          <button (click)="logout()" style="background:#ef4444; margin-top:20px; color:white; border:none; border-radius:8px; padding:10px; cursor:pointer; width:100%;">🚪 Logout</button>
        </nav>
      </aside>

      <main class="content">
<div class='quick-summary' style='width:100%; max-width:600px; display:flex; gap:10px; margin-bottom:15px;'>           <div style='flex:1; background:#1e293b; padding:10px; border-radius:8px; border-bottom:3px solid var(--green); text-align:center;'>             <span style='font-size:0.6rem; color:#94a3b8; display:block;'>TODAY TICKETS</span>             <b style='font-size:1.1rem; color:white;'>{{getTodayCount()}}</b>           </div>           <div style='flex:1; background:#1e293b; padding:10px; border-radius:8px; border-bottom:3px solid #f59e0b; text-align:center;'>             <span style='font-size:0.6rem; color:#94a3b8; display:block;'>TODAY ARRIVALS (PAX)</span>             <b style='font-size:1.1rem; color:white;'>{{getTotalPax('A') + getTotalPax('C')}}</b>           </div>         </div>
        <div class="top-bar-nav" *ngIf="tab !== 'wallet'">
          <button class="btn-back" (click)="setTab('wallet')">🔙 Back to Dashboard</button>
        </div>

        <div class="view-box" *ngIf="tab === 'wallet'">
<div class='md-stats' style='width:100%; display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;'>   <div style='background:rgba(16,185,129,0.1); padding:15px; border-radius:12px; border:1px solid var(--green); text-align:center;'>     <span style='display:block; font-size:0.7rem; color:var(--green);'>MONTHLY SALES (30D)</span>     <b style='font-size:1.2rem;'>{{getSmartStats(30).sell | number:"1.0-0"}}$</b>   </div>   <div style='background:rgba(59,130,246,0.1); padding:15px; border-radius:12px; border:1px solid #3b82f6; text-align:center;'>     <span style='display:block; font-size:0.7rem; color:#3b82f6;'>MONTHLY PROFIT</span>     <b style='font-size:1.2rem;'>{{getSmartStats(30).profit | number:"1.0-0"}}$</b>   </div> </div>
          <div class="wallet-grid">
            <div class="w-card usd-glow"><span>{{totals.USD}}$</span><small>USD WALLET</small></div>
            <div class="w-card eur-glow"><span>{{totals.EUR}}€</span><small>EUR WALLET</small></div>
            <div class="w-card try-glow"><span>{{totals.TRY}}₺</span><small>TRY WALLET</small></div>
            <div class="w-card gbp-glow"><span>{{totals.GBP}}£</span><small>GBP WALLET</small></div>
          </div>
        </div>

        <div class="view-box full-w" *ngIf="tab === 'statement'"> 
<div class="exchange-rates-bar" style="display:flex; gap:15px; background:rgba(16,185,129,0.1); padding:10px; border-radius:8px; margin-bottom:15px; align-items:center; border:1px solid var(--green);"> 
  <span style="font-size:0.8rem; font-weight:bold; color:var(--green)">💹 MARKET RATES (1$ =):</span> 
  <div style="display:flex; align-items:center; gap:5px;"><span>€</span><input type="number" [(ngModel)]="rates.EUR" style="width:70px; margin:0; padding:4px;"></div> 
  <div style="display:flex; align-items:center; gap:5px;"><span>₺</span><input type="number" [(ngModel)]="rates.TRY" style="width:80px; margin:0; padding:4px;"></div> 
  <div style="display:flex; align-items:center; gap:5px;"><span>£</span><input type="number" [(ngModel)]="rates.GBP" style="width:70px; margin:0; padding:4px;"></div> 
</div>
          <h3 class="glow-txt">Live Account Statement (All Sales)</h3> 
          <div style="display:flex; gap:10px; margin-bottom:15px;">             <button class="btn-primary" (click)="downloadReport('MB')" style="background:#10b981; color:white; flex:1;">📄 Download MB Report</button>             <button class="btn-primary" (click)="downloadReport('WB')" style="background:#3b82f6; color:white; flex:1;">📄 Download WB Report</button>           </div>
<div class='md-stats' style='width:100%; display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;'>   <div style='background:rgba(16,185,129,0.1); padding:15px; border-radius:12px; border:1px solid var(--green); text-align:center;'>     <span style='display:block; font-size:0.7rem; color:var(--green);'>MONTHLY SALES (30D)</span>     <b style='font-size:1.2rem;'>{{getSmartStats(30).sell | number:"1.0-0"}}$</b>   </div>   <div style='background:rgba(59,130,246,0.1); padding:15px; border-radius:12px; border:1px solid #3b82f6; text-align:center;'>     <span style='display:block; font-size:0.7rem; color:#3b82f6;'>MONTHLY PROFIT</span>     <b style='font-size:1.2rem;'>{{getSmartStats(30).profit | number:"1.0-0"}}$</b>   </div> </div>
          <div class="wallet-grid"> 
            <div class="w-card usd-glow"><span>{{getTodayStats().totalSell | number:"1.0-2"}}$</span><small>TODAY SALES</small></div> 
            <div class="w-card eur-glow"><span>{{getTodayStats().netProfit | number:"1.0-2"}}$</span><small>TOTAL NET PROFIT</small></div> 
            <div class="w-card try-glow"><span>{{getTodayStats().netProfit * 0.6 | number:"1.0-2"}}$</span><small>COMPANY (60%)</small></div> 
            <div class="w-card gbp-glow"><span>{{getTodayStats().netProfit * 0.4 | number:"1.0-2"}}$</span><small>MY COMM (40%)</small></div> 
          </div> 
          <div class="table-container" style="margin-top:20px; overflow-x: auto;"> 
            <table style="min-width: 900px;"> 
              <thead> 
                <tr> 
                  <th>Activity</th> 
                  <th>Client</th> 
                  <th>Day/Date/Time</th> 
                  <th>Sell</th> 
                  <th>Cost</th> 
                  <th>Profit</th> 
                  <th style="color:#f59e0b">Co. 60%</th> 
                  <th style="color:#10b981">My 40%</th> 
                </tr> 
              </thead> 
              <tbody> 
                <tr *ngFor="let t of getTodayTickets()"> 
                  <td>{{t.trip}}</td> 
                  <td><b>{{t.clientName}}</b></td> 
                  <td><small>{{t.day}} {{t.date}} {{t.time}}</small></td> 
                  <td>{{t.totalPrice}}{{t.currency}}</td> 
                  <td>{{getActivityCost(t)}}{{getCostCurrency(t)}}</td> 
                  <td style="font-weight:bold; color:var(--green)">{{convertToUSD(t.totalPrice, t.currency) - convertToUSD(getActivityCost(t), getCostCurrency(t)) | number:"1.0-2"}}$</td> 
                  <td style="color:#f59e0b">{{(convertToUSD(t.totalPrice, t.currency) - convertToUSD(getActivityCost(t), getCostCurrency(t))) * 0.6 | number:"1.0-2"}}$</td> 
                  <td style="color:#10b981; font-weight:bold;">{{(convertToUSD(t.totalPrice, t.currency) - convertToUSD(getActivityCost(t), getCostCurrency(t))) * 0.4 | number:"1.0-2"}}$</td> 
                </tr> 
              </tbody> 
            </table> 
          </div>
        </div>
        <div class="view-box full-w" *ngIf="tab === 'arrivals'"> 
          <h3 class="glow-txt">🛬 Arrivals Plan</h3> 
          <div class="form-card"> 
            <div class="row"> 
              <input [(ngModel)]="newArrival.name" placeholder="Client Name"> 
              <input [(ngModel)]="newArrival.hotel" placeholder="Hotel Name"> 
            </div> 
            <div class="row"> 
              <input type="date" [(ngModel)]="newArrival.date"> 
              <input [(ngModel)]="newArrival.flight" placeholder="Flight Number"> 
            </div> 
            <div class="pax-row"> 
              <input type="number" [(ngModel)]="newArrival.paxA" placeholder="A"> 
              <input type="number" [(ngModel)]="newArrival.paxC" placeholder="C"> 
              <input type="number" [(ngModel)]="newArrival.paxI" placeholder="I"> 
            </div> 
            <div class="row" style="margin-top:10px;"> 
              <button class="save-btn" (click)="saveArrival()">💾 SAVE ARRIVAL</button> 
              <button class="btn-primary" (click)="downloadArrivalsPDF()">📄 PDF REPORT</button> 
            </div> 
          </div> 
         <div class="table-container" style="margin-top:20px; overflow-x: auto;"> 
  <table style="min-width: 850px; border-collapse: collapse;"> 
    <thead> 
      <tr> 
        <th>Day & Date</th> 
        <th>Client Name</th> 
        <th>Hotel</th> 
        <th>Flight No.</th> 
        <th style="text-align:center">Adult</th> 
        <th style="text-align:center">Child</th> 
        <th style="text-align:center">Infant</th> 
      </tr> 
    </thead> 
    <tbody> 
      <tr *ngFor="let a of arrivals" style="border-bottom: 1px solid rgba(255,255,255,0.1);"> 
        <td>{{a.date}}</td> 
        <td style="border-bottom: 2px solid var(--green);"><b>{{a.name}}</b></td> <td>{{a.hotel}}</td> 
        <td><span style="color:var(--green)">{{a.flight}}</span></td> 
        <td style="text-align:center; border-bottom: 1px dashed #444;">{{a.paxA}}</td> 
        <td style="text-align:center; border-bottom: 1px dashed #444;">{{a.paxC}}</td> 
        <td style="text-align:center; border-bottom: 1px dashed #444;">{{a.paxI}}</td> 
      </tr> 

      <tr style="background: rgba(16, 185, 129, 0.1); font-weight: bold; color: var(--green);">
        <td colspan="4" style="text-align: right; padding-right: 20px;">TOTAL ARRIVALS:</td>
        <td style="text-align:center; border-top: 2px solid var(--green);">{{ getTotalPax('A') }}</td>
        <td style="text-align:center; border-top: 2px solid var(--green);">{{ getTotalPax('C') }}</td>
        <td style="text-align:center; border-top: 2px solid var(--green);">{{ getTotalPax('I') }}</td>
      </tr>
    </tbody> 
  </table>
</div>
        </div>

        <div class="view-box full-w" *ngIf="tab === 'users'">
          <h3 class="glow-txt">👥 Users Control Panel</h3>
          <div class="form-card">
            <div class="row">
              <div><label>Email</label><input [(ngModel)]="newUser.email" placeholder="email@cts.ai"></div>
              <div><label>Password</label><input type="password" [(ngModel)]="newUser.password" placeholder="••••••"></div>
            </div>
            <div class="row">
              <div><label>Guide Name</label><input [(ngModel)]="newUser.guideName" placeholder="Full Name"></div>
              <div><label>Phone Number</label><input [(ngModel)]="newUser.guidePhone" placeholder="+90..."></div>
            </div>
            <label>Position / Role</label>
            <select [(ngModel)]="newUser.role">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="guide">Guide</option>
            </select>
            <div class="row" style="margin-top:10px;">
              <button class="save-btn" (click)="saveUser()">💾 SAVE / UPDATE USER</button>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Phone</th></tr></thead>
              <tbody>
                <tr *ngFor="let u of userList">
                  <td>{{u.email}}</td><td><b>{{u.guideName}}</b></td><td><span class="user-badge" [style.background]="u.role === 'admin' ? '#ef4444' : '#334155'">{{u.role}}</span></td><td>{{u.guidePhone}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="view-box full-w" *ngIf="tab === 'history'">
          <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom:15px; flex-wrap: wrap; gap:10px;">
            <h3 class="glow-txt">Client History</h3>
            <input type="text" [(ngModel)]="searchQuery" placeholder="🔍 Search..." style="max-width:300px; background:#1e293b; color:white; border:1px solid var(--green);">
            <button class="btn-primary" (click)="downloadPDF()">📄 PDF Report</button>
          </div>
<div class="table-container" style="margin-top:20px; overflow-x: auto;"> 
  <table style="min-width: 900px;"> 
    <thead> 
      <tr> 
        <th>Activity</th> 
        <th>Client</th> 
        <th>Hotel</th> <th>Day</th> <th>Date/Time</th> <th>Sell</th> 
        <th>Actions</th>
      </tr> 
    </thead> 
    <tbody> 
      <tr *ngFor="let t of filteredTickets()">  
        <td>{{t.trip}}</td>
        <td><b>{{t.clientName}}</b></td> 
        <td>{{t.hotelName}}</td> <td>{{t.day}}</td> <td><small>{{t.date}} {{t.time}}</small></td> <td style="font-weight:bold; color:var(--green)">{{t.totalPrice}}{{t.currency}}</td> 
        
        <td style="display:flex; gap:5px;">
          <button (click)="print(t)" style="background:#3b82f6; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Print">🖨</button>
          
          <button (click)="copyToClipboard(t)" style="background:#25d366; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Copy to WhatsApp">📋</button> <button (click)="editExistingTicket(t)" style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Edit">✏️</button>  
        </td>
      </tr> 
    </tbody> 
  </table> 
</div>
        </div>

<div class="view-box" *ngIf="tab === 'activities'">
            <h3 class="glow-txt">Activity Cost Setup</h3>
            <div class="form-card">
              <select [(ngModel)]="costSetup.name">
                <option *ngFor="let tour of tourList" [value]="tour">{{tour}}</option>
              </select>
              <div class="row">
                <input type="number" [(ngModel)]="costSetup.adultCost" placeholder="Adult Cost">
                <input type="number" [(ngModel)]="costSetup.childCost" placeholder="Child Cost">
              </div>
              <select [(ngModel)]="costSetup.currency"><option>$</option><option>€</option><option>₺</option><option>£</option></select>
              <div class="row" style="margin-top:10px;">
                <button class="save-btn" (click)="saveActivity()">💾 SAVE</button>
                <button class="btn-re" (click)="editActivity()">✏️ EDIT</button>
                <div style="font-size: 0.8rem; color: #10b981; margin-top: 15px; font-weight: bold; border-top: 1px dashed rgba(16,185,129,0.3); padding-top: 10px;">ℹ️ Infant (0-3) is always Free Cost</div>
              </div>
            </div>

            <div class="table-container" style="margin-top:20px; overflow-x: auto;"> 
              <table style="min-width: 600px;"> 
                <thead> 
                  <tr> 
                    <th>Activity Name</th> 
                    <th>Cost Adult</th> 
                    <th>Cost Children</th> 
                    <th>Infant (0-3)</th> 
                    <th>Cur</th> 
                  </tr> 
                </thead> 
                <tbody> 
                  <tr *ngFor="let act of activities"> 
                    <td><b>{{act.name}}</b></td> 
                    <td>{{act.adultCost}}</td> 
                    <td>{{act.childCost}}</td> 
                    <td style="color:#10b981">0 (Free)</td> 
                    <td>{{act.currency}}</td> 
                  </tr> 
                </tbody> 
              </table> 
            </div>
        </div>

        <div class="overlay" *ngIf="isModal">
          <div class="modal-sheet">
            <div class="m-head">CLIENT SESSION #{{nextID}}</div>
            <div class="m-body">
              <label>CLIENT NAME</label><input [(ngModel)]="active.clientName" [disabled]="clientConfirmed">
              <label>PHONE</label><input [(ngModel)]="active.clientPhone" [disabled]="clientConfirmed">
              <label>HOTEL</label><input list="hotels" [(ngModel)]="active.hotelName" [disabled]="clientConfirmed">
              <datalist id="hotels"><option *ngFor="let h of hotelList" [value]="h"></option></datalist>
              <div class="row">
                <div><label>ROOM</label><input [(ngModel)]="active.roomNo" [disabled]="clientConfirmed"></div>
                <div>
                  <label>PICK UP</label>
                  <select [(ngModel)]="active.pickupPoint" [disabled]="clientConfirmed">
                    <option value="Hotel Lobby">Hotel Lobby</option>
                    <option value="Near Security Gate">Near Security Gate</option>
                    <option value="McDonald's">McDonald's</option>
                    <option value="Mark Antalya">Mark Antalya</option>
                    <option value="Main Road">Main Road</option>
                  </select>
                </div>
              </div>
              <button *ngIf="!clientConfirmed" class="save-btn" (click)="clientConfirmed=true" style="margin-top:10px;">✅ CONFIRM CLIENT</button>
              <button *ngIf="!clientConfirmed" (click)="isModal=false" style="width:100%; border:none; background:none; cursor:pointer; margin-top:10px; color:#ef4444; font-weight:bold;">❌ CANCEL</button>
              
              <div *ngIf="clientConfirmed" style="margin-top:15px; border-top:1px solid #ccc; padding-top:10px;">
                <label>TRIP</label>
                <select [(ngModel)]="active.trip" (change)="updateAutoPrice()">
                  <option *ngFor="let tour of tourList" [value]="tour">{{tour}}</option>
                </select>
                <label>NOTE</label>
                <input [(ngModel)]="active.note" placeholder="Add your note here...">
                <div class="row"><input type="date" [(ngModel)]="active.date"><input type="time" [(ngModel)]="active.time"></div>
                <div class="pax-row">
                  <input type="number" [(ngModel)]="active.paxA" (change)="updateAutoPrice()" placeholder="A">
                  <input type="number" [(ngModel)]="active.paxC" (change)="updateAutoPrice()" placeholder="C">
                  <input type="number" [(ngModel)]="active.paxI" placeholder="I">
                </div>
                <div class="row">
                  <input type="number" [(ngModel)]="active.totalPrice" placeholder="Total Price">
                  <select [(ngModel)]="active.currency"><option>$</option><option>€</option><option>₺</option><option>£</option></select>
                </div>
                <input type="number" [(ngModel)]="active.deposit" placeholder="Deposit">
                <div class="balance" [style.color]="(active.totalPrice - active.deposit) === 0 ? '#10b981' : '#ff4444'">
                  {{(active.totalPrice - active.deposit) === 0 ? 'ALL PAID' : 'REST: ' + (active.totalPrice - active.deposit) + active.currency}}
                </div>
                <div style="display:flex; gap:10px; margin-top:10px;">
                  <button class="save-btn" style="margin-bottom:10px; background:#f59e0b" (click)="addToQueue()">💾 SAVE TO DATABASE</button>
                  <button class="btn-re" style="flex:1; background:#a855f7" (click)="addToQueue()">➕ Add Another Trip</button>
                  <button class="btn-re" style="flex:1; background:#3b82f6" (click)="printSingleOnly(active)">🖨 Print</button>
                </div>
              </div>
            </div>
            <div class="m-foot" *ngIf="clientConfirmed">
              <button class="save-btn" (click)="finalizeAll()">💾 FINISH ALL</button>
              <button (click)="isModal=false" style="border:none; background:none; cursor:pointer;">CANCEL</button>
            </div>
          </div>
        </div>

        <footer class="main-footer">
          <div class="footer-line"></div>
          <div class="footer-content">
            <span>Designed by <b class="glow-txt">ÖZCAN ALMAIS</b></span>
            <span>2026 © CTS AI MASTER</span>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    :host { --green: #10b981; --bg: #0f172a; --card: #1e293b; --glow: rgba(16, 185, 129, 0.3); }
    .app-container { min-height: 100vh; background: var(--bg); color: white; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; }
    .navbar { height: 60px; background: var(--card); display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 2px solid var(--green); position: fixed; width: 100%; z-index: 100; box-sizing: border-box; }
    .logo { font-weight: 900; color: var(--green); text-shadow: 0 0 10px var(--glow); }
    .user-badge { font-size: 0.7rem; background: #334155; padding: 4px 10px; border-radius: 20px; }
    .menu-btn span { display: block; width: 20px; height: 2px; background: white; margin: 4px 0; }
    .drawer { position: fixed; left: -260px; top: 60px; bottom: 0; width: 250px; background: var(--card); transition: 0.4s; z-index: 99; padding: 20px; border-right: 1px solid rgba(255,255,255,0.1); }
    .nav-open .drawer { left: 0; }
    .links button { width: 100%; padding: 12px; margin-bottom: 12px; border-radius: 8px; border: none; background: #334155; color: white; text-align: left; transition: 0.3s; cursor: pointer; }
    .links button.active { background: var(--green); color: black; font-weight: bold; }
    .content { padding: 80px 10px 20px; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; flex: 1; }
    .top-bar-nav { width: 100%; max-width: 600px; margin-bottom: 15px; }
    .btn-back { background: transparent; border: 1px solid var(--green); color: var(--green); padding: 5px 12px; border-radius: 5px; cursor: pointer; }
    .view-box { width: 100%; max-width: 600px; }
    .view-box.full-w { max-width: 100%; }
    .wallet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .w-card { background: var(--card); padding: 15px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; border-left: 4px solid var(--green); }
    .usd-glow { border-left-color: #ef4444; } .eur-glow { border-left-color: #3b82f6; } .try-glow { border-left-color: #10b981; } .gbp-glow { border-left-color: #a855f7; }
    .form-card { background: var(--card); padding: 15px; border-radius: 12px; margin-bottom: 15px; }
    .table-container { width: 100%; overflow-x: auto; background: var(--card); border-radius: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { background: rgba(16, 185, 129, 0.2); color: var(--green); text-align: left; padding: 10px; }
    td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 10px; }
    .modal-sheet { background: white; color: black; width: 100%; max-width: 380px; border-radius: 12px; padding: 15px; max-height: 95vh; display: flex; flex-direction: column; }
    .m-body { overflow-y: auto; flex: 1; }
    input, select { width: 100%; padding: 10px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .pax-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    label { font-size: 0.65rem; font-weight: bold; color: var(--green); display: block; margin-bottom: 3px; }
    .balance { background: #000; color: #fff; padding: 10px; border-radius: 6px; text-align: center; font-weight: bold; }
    .save-btn { width: 100%; background: var(--green); color: white; padding: 14px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; }
    .btn-re { background: #334155; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: var(--green); color: black; font-weight: bold; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer; }
    .glow-txt { color: var(--green); text-shadow: 0 0 5px var(--glow); margin-bottom: 10px; }
    .main-footer { width: 100%; padding: 20px 0; margin-top: auto; background: var(--bg); text-align: center; }
    .footer-line { height: 1px; background: linear-gradient(90deg, transparent, var(--green), transparent); width: 80%; margin: 0 auto 15px; opacity: 0.5; }
    .footer-content { display: flex; flex-direction: column; gap: 5px; font-size: 0.75rem; color: #64748b; letter-spacing: 1px; }
  `]
})
export class DashboardComponent implements OnInit {
  ls = localStorage;
  getLogoPixels() { 
    const base64Data = "f0f0f0f0f0f0f0f0ffffffffffff00000000ffffffff"; /* تم ضغط بيانات اللوغو هنا */ 
    const raw = atob("H4sIAAAAAAAAA+3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAIC3AYbS798AKAAA"); 
    return [0x1B, 0x61, 0x01, 0x1D, 0x76, 0x30, 0x00, 0x30, 0x00, 0x30, 0x00, ...new Uint8Array(512).fill(0x55), 0x0A]; 
  }
  getLogoGraphic() { 
    const GS = 0x1D; const v = 0x76; const zero = 0x30; 
    const header = [GS, v, zero, 0, 8, 0, 40, 0]; 
    const dots = new Array(320).fill(0xAA); 
    return [0x1B, 0x61, 0x01, ...header, ...dots, 0x0A, 0x1B, 0x61, 0x00]; 
  }
  getTodayCount() { return this.getTodayTickets().length; }
  getTodayTickets() { 
    const today = new Date().toISOString().split("T")[0]; 
    return this.tickets; 
  } 
  getCostCurrency(t: any) { 
    const act = this.activities.find(a => a.name === t.trip); 
    return act ? act.currency : t.currency; 
  }
  getActivityCost(t: any) { 
    const act = this.activities.find(a => a.name === t.trip); 
    if (!act) return 0; 
    return (Number(t.paxA) * Number(act.adultCost)) + (Number(t.paxC) * Number(act.childCost)); 
  }
  getTodayStats() { this.calc(); 
    let stats = { totalSell: 0, netProfit: 0 }; 
    this.getTodayTickets().forEach(t => { 
      const sell = Number(t.totalPrice) || 0; 
      const cost = this.getActivityCost(t); 
      stats.totalSell += this.convertToUSD(sell, t.currency);
      stats.netProfit += (this.convertToUSD(sell, t.currency) - this.convertToUSD(cost, this.getCostCurrency(t)));
    }); 
    return stats; 
  }
  isNav = false; isModal = false; tab = this.ls.getItem('lastTab') || 'wallet';
  getLogoBytes() { 
    const CENTER = [0x1B, 0x61, 0x01]; 
    const BITMAP_COMMAND = [0x1D, 0x76, 0x30, 0x00, 0x20, 0x00, 0x40, 0x00]; 
    const logoData = new Array(512).fill(0xAA); 
    return [...CENTER, ...BITMAP_COMMAND, ...logoData, 0x1B, 0x61, 0x00, 0x0A]; 
  }
  rates = { EUR: 0.84, TRY: 43.74, GBP: 0.74 };
  convertToUSD(amount: number, currency: string): number { 
    if (!amount) return 0; 
    switch (currency) { 
      case "₺": return amount / this.rates.TRY; 
      case "€": return amount / this.rates.EUR; 
      case "£": return amount / this.rates.GBP; 
      default: return amount; 
    } 
  }
  clientConfirmed = false; searchQuery = '';
  tempQueue: any[] = []; tickets: any[] = []; activities: any[] = [];
  arrivals: any[] = []; userList: any[] = [];
  userRole: 'admin' | 'user' = (localStorage.getItem('userRole') as 'admin' | 'user') || 'user'; currentUserEmail = '';
  nextID = 3301;
  active = this.init();
  costSetup = { name: 'Antalya City Tour', adultCost: 0, childCost: 0, currency: '$' };
  newArrival = { name: '', hotel: '', date: '', flight: '', paxA: 1, paxC: 0, paxI: 0 };
  
  newUser = { email: '', password: '', guideName: '', guidePhone: '', role: 'guide' };
  async saveUser() { if(!this.newUser.email) return; await setDoc(doc(db, 'users', this.newUser.email), this.newUser); alert('User Updated!'); this.newUser = { email: '', password: '', guideName: '', guidePhone: '', role: 'guide' }; }

  tourList = ['Antalya City Tour', 'Suluada', 'Manavgat Boat & Bazaar', 'Green Canyon', 'Horse Riding', 'Akvaryum', '4-in-1 Combo', 'Diving', 'Non-Diving', 'Pamukkale', 'Pamukkale & Balloon', 'Mega Star Antalya', 'Mega Star Kemer', 'Land of Legends Night', 'Land of Legends Theme Park', 'Jeep Safari', 'Alanya Parachute', 'Lion Safari', 'Vip turkish hamam', 'turkish hamam', 'alanya one way old town', 'alanya one way airport', 'Vip transfer', 'Panther Safari', 'Cappadocia', 'Other services'];
  hotelList = ['Adam & Eve Hotel', 'Akra Barut Hotel', 'Akra Barut Park', 'Aksu Holiday Hotel', 'Alp Pasa Hotel', 'Amara Dolce Vita Luxury', 'Anfora Hotel', 'Antalya Hotel Resort & Spa', 'Argos Hotel', 'Aspen Hotel', 'Askıa Lara Resort & SPA', 'Aydınbey Famous Resort', 'Aydınbey Queen’s Palace & Spa', 'Ayana Hotel', 'Bellevue Resort', 'Calista Luxury Resort', 'Citrus Park Hotel', 'Concorde De Luxe Resort', 'Cornelia De Luxe Resort', 'Cornelia Diamond Golf Resort & SPA', 'Cornelia Azure Villas', 'Crystal Boutique Beach Resort', 'Crystal Family Resort & SPA', 'Crystal Paraiso Verde Resort & SPA', 'Crystal Tat Beach Golf Resort & SPA', 'Crystal Waterworld Resort & SPA', 'Delphin Palace', 'Delphin Be Grand', 'Elysium Resort & Spa', 'Ela Quality Resort Belek', 'Fame Residence Lara', 'Four Seasons Antalya', 'Gloria Golf Resort', 'Gloria Serenity Resort', 'Gloria Verde Resort', 'Grand Park Lara', 'Hadrianus Hotel', 'IC Hotels Green Palace', 'IC Hotels Residence', 'IC Hotels Santai', 'IC Hotels Sport', 'InterContinental Antalya', 'Kayı Hotel', 'Kirman Hotels Belek', 'Kundu Hotel', 'Kiriş Beach Hotel', 'Konyaaltı Hotel', 'Köprüçay Hotel', 'Lara Barut Collection', 'Limak Atlantis Deluxe Hotel & Resort', 'Mardan Palace', 'Megasaray Westbeach Antalya', 'Nirvana Cosmopolitan', 'Orange County Resort Hotel Belek', 'Paloma Grida Resort & Spa', 'Papillon Zeugma Relaxury', 'Papillon Ayscha', 'Papillon Belvil', 'Port Royal Hotel', 'Porto Bello Hotel Resort & Spa', 'Prime Boutique Hotel', 'Rixos Downtown Antalya', 'Robinson Club Nobilis', 'Royal Adam & Eve Hotel', 'Royal Holiday Palace', 'Royal Seginus', 'Royal Wings Hotel', 'Susesi Luxury Resort', 'Sueno Hotels Deluxe Belek', 'Sueno Hotels Golf Belek', 'The Marmara Antalya', 'Titanic Beach Lara Resort', 'Titanic Deluxe Golf Belek', 'TUI Magic Life Belek', 'Veranda Beach Suites', 'Veranda Resort Spa', 'Voyage Belek Golf & Spa', 'Wind of Lara Hotel & SPA', 'Wyndham Garden Lara Resort', 'Zeynel Boutique Hotel', 'Af-Ra Hotel', 'Akropol Beach Hotel', 'Antalya Af-Ra Hotel', 'Antalya Deluxe Hotel', 'Antalya Ocean Palace', 'Antalya Prestige Hotel', 'Antalya Royal Hotel', 'Antalya Star Hotel', 'Aparthotel Konyaaltı Beach', 'Ares City Hotel', 'Aroma Hotel', 'Aspendos Beach Hotel', 'Asteria Hotel', 'Atelya Art Hotel', 'Avalon Hotel', 'Bella Napa Hotel', 'Bellis Deluxe Hotel', 'Best Western Plus Khan Hotel', 'Beverly Hills Hotel', 'Blue Garden Hotel', 'Blue Night Hotel', 'Boran Mare Beach Hotel', 'Broadway Hotel', 'Brava Hotels & Spa Antalya', 'Camelot Beach Hotel', 'Cender Hotel', 'Central Park Hotel', 'City Center Hotel', 'Club Hotel Falcon', 'Club Hotel Turan Prince World', 'Deluxe City Hotel', 'Delfino Boutique Hotel', 'Diamond Hill Resort Hotel', 'Dine Hotel', 'Dolphin Hotel', 'Dome Hotel', 'Dorak Hotel', 'Dream World Resort & Spa', 'Dunes Hotel', 'Echor Hotel', 'Eden Beach Resort', 'Elite World Hotel', 'Emerald Hotel', 'Eresin Hotel', 'Eski Lara Hotel', 'Etap Altınkum Hotel', 'Euphoria Palm Beach Resort', 'Euphoria Tekirova Hotel', 'Eva Hotel', 'Ever Ephesus Hotel', 'Excelsior Hotel', 'Exporoyal Hotel', 'Eyüp Sultan Hotel', 'Fairmont Quasar', 'Fanar Hotel', 'Faselis Hotel', 'Flora Park Deluxe Hotel', 'Fortune Resort Hotel', 'Four Hills Hotel', 'G Hotel', 'Gardenia Hotel', 'Ganymede Hotel', 'Gloria Verde Belek', 'Golf Resort Hotel', 'Grand Hotel Lara', 'Grand Özgür Hotel', 'Green Forest Hotel', 'Gul Beach Hotel', 'Gürsu Hotel', 'Hane Garden Hotel', 'Harmony Hotel', 'Hasan Dosta Hotel', 'Hillside Beach Club', 'Holiday Garden Resort', 'Holiday Inn Antalya', 'Hotel 1207 Antalya', 'Hotel S White', 'Hotel Lunay', 'Hotel Rodinn Park', 'Hotel Saphir', 'Hotel Sevgior', 'Hotel Sunprime Lara', 'Incekum Beach Resort', 'İnterTurk Hotel', 'Jolly Hotel', 'Kervansaray Hotel', 'Kremlin Palace', 'Kirman Hotels Resort', 'Kumsal Hotel', 'Lalezar Hotel', 'Lara Hills Hotel', 'La Vista Boutique Hotel', 'Le Meridien Antalya', 'Lincoln Hotel', 'Lonicera World Hotel', 'Lorien Hotel', 'Lotus Hotel', 'Lucida Beach Resort', 'Lunapark Hotel', 'Mavi Beyaz Hotel', 'Mediterranean Palace', 'Mercure Hotel Antalya', 'Mirage Park Resort', 'Monart City Hotel', 'Nergiz Hotel', 'New Bella Hotel', 'Nihat Hotel', 'Nobel Hotel', 'Oktay Hotel', 'Olsen Apartment Hotel', 'Palmiye Hotel', 'Pam Beach Hotel', 'Park Side Hotel', 'Pera Hotel', 'Pine Club', 'Plaza Hotel Antalya', 'Poseidon Hotel', 'Prestige Beach Resort', 'Prime Residence Hotel', 'Queen’s Park Le Jardin', 'Queen’s Park Tekirova', 'Rada Hotel', 'Reef Hotel', 'Reisdere Hotel', 'Resort World Antalya', 'Riviera Hotel', 'Royal City Hotel', 'Royal Grand Hotel', 'Ruby Hotel', 'S-Port Hotel', 'Sapphire Beach Hotel', 'Scarlet Hotel', 'Sea Breeze Hotel', 'Sealife Family Resort Hotel', 'Serena Hotel', 'Sherwood Dreams Resort', 'Side Star Resort', 'Silver Beach Hotel', 'Sky Tower Hotel', 'Star Palace Hotel', 'Sun City Hotel', 'Sun Club Hotel', 'SunFire Beach Hotel', 'Sunshine Holiday Resort', 'Surmeli Hotel', 'Tadım Hotel', 'Talya Hotel', 'Tarçın Hotel', 'Teos Village Hotel', 'The Corner Park Hotel', 'The Grand Hotel', 'The Key Hotel', 'The Land Of Legends Hotel', 'Titanic City Lara', 'Tower Hotel', 'Truva Hotel', 'Turquoise Hotel', 'Tuscany Hotel', 'Twin Hotels', 'Utopia World Hotel', 'Valide Sultan Hotel', 'Vantage Deluxe Resort', 'Vela Hotel', 'Venice Hotel', 'Verona Hotel', 'Villa Konyaaltı', 'Vista Hill Hotel', 'Waterfront Hotel', 'White Garden Hotel', 'World of Wonders Resort', 'Wyndham Grand Antalya', 'Xanadu Resort Hotel', 'Yeni Lara Hotel', 'Yelken Hotel', 'Yıldız Park Hotel', 'Yuva Hotel', 'Zaga Hotel', 'Zenith Hotel', 'Zeynep Hotel', 'Zeus Hotel', 'Zorlu Grand Hotel', 'Ada Beach Hotel', 'Akdeniz Beach Hotel', 'Anadolu Hotel', 'Antalya Plaza Hotel', 'Beach Star Hotel', 'Blue Wave Hotel', 'Caretta Beach Hotel', 'Costa Hotel', 'Delta Hotel', 'Efe Hotel', 'Elite City Hotel', 'Flora Suites Hotel', 'Garden Beach Hotel', 'Holiday Park Hotel', 'Ideal Beach Resort', 'Jasmine Hotel', 'Kalemci Hotel', 'Limra Park Hotel', 'Midtown Hotel', 'Natura Hotel', 'Ocean Blue Hotel', 'Paradise Garden Hotel', 'Queen Hotel', 'Riviera Park Hotel', 'Sunshine Garden Hotel', 'Tropic Hotel', 'Ultra Beach Hotel', 'View Hotel', 'Waterfront Resort', 'Xenon Hotel', 'Yakamoz Hotel', 'Zest Hotel', 'Aqua Bella Hotel', 'Bella Vista Hotel', 'City Suite Hotel', 'Dream Beach Hotel', 'Emerald Beach Hotel', 'Flora Coral Hotel', 'Green Valley Hotel', 'Horizon Beach Hotel'];

  totals = { USD: 0, EUR: 0, TRY: 0, GBP: 0 };

init() { 
    const now = new Date();
    return { 
      ticketNumber: 0, 
      clientName: '', 
      clientPhone: '', 
      hotelName: '', 
      roomNo: '', 
      pickupPoint: 'Hotel Lobby', 
      trip: 'Antalya City Tour', 
      note: '', 
      date: now.toISOString().split('T')[0], 
      time: now.toTimeString().split(' ')[0].substring(0,5),
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      paxA: 1, 
      paxC: 0, 
      paxI: 0, 
      totalPrice: 0, 
      deposit: 0, 
      currency: '$',
      uid: auth.currentUser?.uid || '', 
      guideName: 'MOHAMAD', 
      guidePhone: '+905010031232'
    }; 
  }

  ngOnInit() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserEmail = user.email || '';
        this.userRole = (this.currentUserEmail === 'admin@cts.ai') ? 'admin' : 'user';
        localStorage.setItem('userRole', this.userRole);
        this.syncFirebase();
      } else {
        window.location.href = '/login';
      }
    });
  }

  syncFirebase() {
    onSnapshot(collection(db, "activities"), (snap) => { this.activities = snap.docs.map(d => d.data()); });
    onSnapshot(collection(db, "arrivals"), (snap) => { this.arrivals = snap.docs.map(d => d.data()); });
    
    // مراقبة حية للتذاكر (أي حركة بيع ستحدث الـ Wallet فوراً)
    onSnapshot(collection(db, "tickets"), (snap) => {
      let all = snap.docs.map(d => ({id: d.id, ...d.data()}));
      this.tickets = (this.userRole === 'admin') ? all : all.filter((t:any) => t.uid === auth.currentUser?.uid);
      this.tickets.sort((a,b) => b.ticketNumber - a.ticketNumber);
      if (this.tickets.length > 0) this.nextID = Math.max(...this.tickets.map(x => x.ticketNumber)) + 1;
      
      // هنا السحر: استدعاء الحساب اللحظي
      this.calc();
    });

    if (this.userRole === 'admin') {
      onSnapshot(collection(db, 'users'), (snap) => { this.userList = snap.docs.map(d => ({id: d.id, ...d.data()})); });
    }
  }

  updateAutoPrice() { 
    const act = this.activities.find(x => x.name === this.active.trip); 
    if(act) { 
      // الربط مع كلفة النشاط
      this.active.totalPrice = (Number(this.active.paxA) * Number(act.adultCost)) + (Number(this.active.paxC) * Number(act.childCost)); 
      this.active.currency = act.currency; 
    } 
  }

  filteredTickets() {
    if (!this.searchQuery) return this.tickets;
    const q = this.searchQuery.toLowerCase();
    return this.tickets.filter(t => t.clientName.toLowerCase().includes(q) || t.clientPhone.includes(q));
  }

  async saveActivity() { await setDoc(doc(db, "activities", this.costSetup.name), this.costSetup); alert("Saved!"); }
  editActivity() { const act = this.activities.find(x => x.name === this.costSetup.name); if(act) this.costSetup = {...act}; }
  async saveArrival() { await addDoc(collection(db, "arrivals"), this.newArrival); alert("Arrival Saved!"); this.newArrival = { name: '', hotel: '', date: '', flight: '', paxA: 1, paxC: 0, paxI: 0 }; }
  openForm() { this.active = this.init(); this.clientConfirmed = false; this.tempQueue = []; this.isModal = true; }
  addToQueue() { this.tempQueue.push({...this.active, ticketNumber: this.nextID + this.tempQueue.length, createdAt: new Date().toISOString().split('T')[0]}); const c = { clientName: this.active.clientName, clientPhone: this.active.clientPhone, hotelName: this.active.hotelName, roomNo: this.active.roomNo, pickupPoint: this.active.pickupPoint }; this.active = { ...this.init(), ...c, totalPrice: 0, deposit: 0 }; }
  async printSingleOnly(t: any) { await this.print({...t, ticketNumber: this.nextID + this.tempQueue.length, createdAt: new Date().toISOString().split('T')[0]}); }

  async finalizeAll() { 
    if (this.active.totalPrice > 0) this.addToQueue(); 
    for (const t of this.tempQueue) { 
      await addDoc(collection(db, "tickets"), t); 
      await this.print(t); 
    } 
    this.isModal = false; 
    alert("Finalized!"); 
  }

  // حساب المحفظة بشكل لحظي وصحيح
  calc() {
    this.totals = { USD: 0, EUR: 0, TRY: 0, GBP: 0 };
    this.tickets.forEach(t => {
      const amt = Number(t.totalPrice) || 0;
      if (t.currency === '$') this.totals.USD += amt;
      else if (t.currency === '€') this.totals.EUR += amt;
      else if (t.currency === '₺') this.totals.TRY += amt;
      else if (t.currency === '£') this.totals.GBP += amt;
    });
  }

  logout() { localStorage.removeItem('userRole'); signOut(auth); window.location.href = "/login"; }

  async print(t: any) {
    const logoBytes = this.getLogoBytes();
    const BOLD_ON = "\x1B\x45\x01"; const BOLD_OFF = "\x1B\x45\x00";
    const rest = Number(t.totalPrice) - Number(t.deposit);
    const payStatus = rest === 0 ? "ALL PAID" : `REST: ${rest} ${t.currency}`;
    const d = t.date.split('-'); const formattedDate = `${d[2]}/${d[1]}/${d[0]}`;
    const msg = `${BOLD_ON}TOURISTIC MANIA${BOLD_OFF}\nTICKET NO: #${t.ticketNumber}\n--------------------------------\n${BOLD_ON}TRIP: ${t.trip}${BOLD_OFF}\n${t.note ? 'NOTE: ' + t.note + '\n' : ''}--------------------------------\nDAY: ${t.day}\nDATE: ${formattedDate} ${t.time}\n--------------------------------\nCLIENT: ${t.clientName}\nPHONE: ${t.clientPhone}\nHOTEL: ${t.hotelName}\nROOM: ${t.roomNo}\nPAX: A:${t.paxA} C:${t.paxC} I:${t.paxI}\n${BOLD_ON}PICK UP: ${t.pickupPoint}${BOLD_OFF}\n--------------------------------\nPRICE: ${t.totalPrice} ${t.currency}\nPAID: ${t.deposit} ${t.currency}\n${BOLD_ON}${payStatus}${BOLD_OFF}\n--------------------------------\nGUIDE: ${t.guideName}\nTEL: ${t.guidePhone}\n--------------------------------\n${BOLD_ON}Note: Cancellation is non-refundable${BOLD_OFF}\n\n\n\n\n`;

    try {
      const device = await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'] });
      const server = await device.gatt.connect();
      const services = await server.getPrimaryServices();
      let targetChar;
      for (const s of services) {
        const chars = await s.getCharacteristics();
        targetChar = chars.find((c: any) => c.properties.write || c.properties.writeWithoutResponse);
        if (targetChar) break;
      }
      const encoder = new TextEncoder(); const data = encoder.encode(msg);
      for (let i = 0; i < data.length; i += 20) {
        await targetChar.writeValue(data.slice(i, i + 20));
        await new Promise(r => setTimeout(r, 60));
      }
    } catch (e) { console.log("Print failed"); }
  }

  downloadArrivalsPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('Touristic Mania Arrivals Report', 14, 15);
    
    const data = this.arrivals.map(a => [
      a.date, 
      a.name, 
      a.hotel, 
      a.flight, 
      a.paxA, 
      a.paxC, 
      a.paxI
    ]);

    data.push([
      { content: 'TOTALS', colSpan: 4, styles: { halign: 'right', fillColor: [240, 240, 240], fontStyle: 'bold' } },
      { content: this.getTotalPax('A').toString(), styles: { fontStyle: 'bold', fillColor: [210, 255, 210] } },
      { content: this.getTotalPax('C').toString(), styles: { fontStyle: 'bold', fillColor: [210, 255, 210] } },
      { content: this.getTotalPax('I').toString(), styles: { fontStyle: 'bold', fillColor: [210, 255, 210] } }
    ]);

    autoTable(doc, { 
      head: [['Date', 'Client Name', 'Hotel', 'Flight No.', 'Adult', 'Child', 'Infant']], 
      body: data, 
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('Arrivals_Plan.pdf');
  }

  downloadPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('Touristic Mania - Client History', 14, 15);
    
    const data = this.tickets.map(t => [
      t.ticketNumber, 
      t.clientName, 
      t.hotelName, 
      t.trip, 
      t.paxA, 
      t.paxC, 
      t.paxI, 
      t.day, 
      t.date, 
      t.time, 
      t.totalPrice + t.currency
    ]);

    autoTable(doc, { 
      head: [['Ticket №', 'Name', 'Hotel', 'Trip', 'Pax A', 'Pax C', 'Pax I', 'Day', 'Date', 'Time', 'Price']], 
      body: data, 
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 }
    });

    doc.save('Client_History_Report.pdf');
  }
  copyToClipboard(t: any) {     const text = `*TOURISTIC MANIA*\n\n*TOUR VOUCHER*#${t.ticketNumber}\n\n*TRIP:* ${t.trip}\n*CLIENT:* ${t.clientName}\n*DATE:* ${t.date} | ${t.time}\n*PAX:* A:${t.paxA} C:${t.paxC} I:${t.paxI}\n*PICKUP:* ${t.pickupPoint}\n*HOTEL:* ${t.hotelName}\n\n*Room:* ${t.roomNo}\n*PRICE:* ${t.totalPrice}${t.currency}\n*STATUS:* ${Number(t.totalPrice)-Number(t.deposit) === 0 ? 'ALL PAID' : 'REST: ' + (Number(t.totalPrice)-Number(t.deposit)) + t.currency}\n\n*GUIDE:* ${t.guideName}\n*TEL:* ${t.guidePhone}`;     navigator.clipboard.writeText(text).then(() => alert('Copied to Clipboard!'));   }
 editExistingTicket(t: any) {
    this.active = { ...t };
    this.clientConfirmed = true;
    this.isModal = true;
  }

  getTotalPax(type: 'A' | 'C' | 'I') {
    return this.arrivals.reduce((sum, a) => {
      if (type === 'A') return sum + (Number(a.paxA) || 0);
      if (type === 'C') return sum + (Number(a.paxC) || 0);
      if (type === 'I') return sum + (Number(a.paxI) || 0);
      return sum;
    }, 0);
  }
  getSmartStats(days: number) { 
    const limit = new Date(); 
    limit.setDate(limit.getDate() - days); 
    let s = { sell: 0, profit: 0 }; 
    this.tickets.forEach(t => { 
      const tDate = new Date(t.date); 
      if (tDate >= limit) { 
        const sellUSD = this.convertToUSD(t.totalPrice, t.currency); 
        const costUSD = this.convertToUSD(this.getActivityCost(t), this.getCostCurrency(t)); 
        s.sell += sellUSD; 
        s.profit += (sellUSD - costUSD); 
      } 
    }); 
    return s; 
  } 
  downloadReport(type: "MB" | "WB") { 
    const doc = new jsPDF("p", "mm", "a4"); 
    const title = type === "MB" ? "Monthly Business Report (MB)" : "Weekly Business Report (WB)"; 
    const days = type === "MB" ? 30 : 7; 
    const s = this.getSmartStats(days); 
    doc.setFontSize(18); doc.text(title, 14, 15); 
    const data = [ 
      ["Period", type === "MB" ? "Last 30 Days" : "Last 7 Days"], 
      ["Total Sales", s.sell.toFixed(2) + "$"], 
      ["Net Profit", s.profit.toFixed(2) + "$"], 
      ["Company (60%)", (s.profit * 0.6).toFixed(2) + "$"], 
      ["Commission (40%)", (s.profit * 0.4).toFixed(2) + "$"] 
    ]; 
    autoTable(doc, { head: [["Description", "Amount (USD)"]], body: data, startY: 25, theme: "grid", headStyles: {fillColor: type === "MB" ? [16, 185, 129] : [59, 130, 246]} }); 
    doc.save(type + "_Report_" + new Date().toISOString().split("T")[0] + ".pdf"); 
  }
  setTab(name: string) { this.tab = name; this.ls.setItem("lastTab", name); this.isNav = false; }
}