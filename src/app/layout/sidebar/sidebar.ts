import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <h2>CTS</h2>

      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/clients" routerLinkActive="active">Clients</a>
        <a routerLink="/clients/create" routerLinkActive="active">Add Client</a>
      </nav>

      <div class="logout">
        <button (click)="logout()">Logout</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: #0f172a;
      color: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    h2 {
      margin-bottom: 30px;
    }

    nav a {
      display: block;
      padding: 10px;
      color: #cbd5e1;
      text-decoration: none;
      border-radius: 6px;
      margin-bottom: 6px;
    }

    nav a.active, nav a:hover {
      background: #1e293b;
      color: #fff;
    }

    .logout {
      margin-top: auto;
    }

    button {
      width: 100%;
      padding: 10px;
      border: none;
      background: #ef4444;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class SidebarComponent {
  logout() {
    window.location.href = '/login';
  }
}
