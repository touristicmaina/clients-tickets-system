import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-kpi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi">
      <div class="icon">{{ icon }}</div>
      <div class="info">
        <span>{{ title }}</span>
        <strong>{{ value }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .kpi {
      display:flex;
      align-items:center;
      gap:16px;
      padding:20px;
      border-radius:16px;
      background: var(--card);
      box-shadow: 0 10px 30px rgba(0,0,0,.08);
      animation: fadeUp .5s ease;
    }

    .icon {
      font-size:28px;
    }

    .info span {
      font-size:14px;
      color: var(--muted);
    }

    .info strong {
      font-size:22px;
      display:block;
    }

    @keyframes fadeUp {
      from { opacity:0; transform: translateY(10px); }
      to { opacity:1; transform:none; }
    }
  `]
})
export class DashboardKpiComponent {
  @Input() title = '';
  @Input() value: any;
  @Input() icon = '';
}
