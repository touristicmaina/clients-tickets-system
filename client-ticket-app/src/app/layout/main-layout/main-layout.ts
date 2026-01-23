import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="layout">

      <aside class="sidebar">
        <h2>CTS</h2>

        <nav>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/clients">Clients</a>
          <a routerLink="/clients/create">Add Client</a>
        </nav>

        <button class="logout" (click)="logout()">Logout</button>
      </aside>

      <div class="main">

        <header class="topbar">
          Clients & Tickets System
        </header>

        <section class="content">
          <router-outlet></router-outlet>
        </section>

        <footer class="footer">
          © ÖZCAN ALMAIS 2026 — All rights reserved
        </footer>

      </div>

    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 220px;
      background: #111827;
      color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .sidebar h2 {
      margin-bottom: 30px;
    }

    nav a {
      color: #d1d5db;
      text-decoration: none;
      margin-bottom: 14px;
      display: block;
    }

    nav a:hover {
      color: white;
    }

    .logout {
      margin-top: auto;
      background: #ef4444;
      border: none;
      padding: 10px;
      color: white;
      border-radius: 6px;
      cursor: pointer;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f7f7f7;
    }

    .topbar {
      height: 56px;
      background: white;
      padding: 0 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .content {
      flex: 1;
      padding: 24px;
    }

    .footer {
      text-align: center;
      padding: 12px;
      font-size: 13px;
      color: #777;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class MainLayoutComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
