import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  <div class="app-container">
    <aside class="sidebar">
      <h2 class="logo">System</h2>

      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/clients" routerLinkActive="active">Clients</a>
        <a routerLink="/clients/create" routerLinkActive="active">Add Client</a>
      </nav>

      <button class="logout" (click)="logout()">Logout</button>
    </aside>

    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .sidebar {
      width: 240px;
      background: #0f172a;
      color: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .logo {
      margin-bottom: 30px;
      font-size: 22px;
      font-weight: bold;
    }

    nav a {
      display: block;
      padding: 12px 10px;
      color: #cbd5f5;
      text-decoration: none;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    nav a.active,
    nav a:hover {
      background: #1e293b;
      color: #fff;
    }

    .logout {
      margin-top: auto;
      padding: 10px;
      border: none;
      background: #dc2626;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
    }

    .content {
      flex: 1;
      padding: 40px;
      background: #f1f5f9;
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
