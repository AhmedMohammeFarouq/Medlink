import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslatePipe],
  template: `
    <div class="medlink-page-header" [ngClass]="'theme-' + role">
      <div class="header-main">
        <div class="header-icon-badge" *ngIf="icon">
          <app-icon [name]="icon" [size]="24"></app-icon>
        </div>
        <div class="header-titles">
          <div class="header-badge" *ngIf="badge">
            <span>{{ badge | translate }}</span>
          </div>
          <h1 class="header-title">{{ title | translate }}</h1>
          <p class="header-subtitle" *ngIf="subtitle">{{ subtitle | translate }}</p>
        </div>
      </div>
      <div class="header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .medlink-page-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem 1rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all var(--transition-base);
    }

    @media (min-width: 640px) {
      .medlink-page-header {
        padding: 1.5rem 1.75rem;
        border-radius: var(--radius-xl);
      }
    }

    @media (min-width: 768px) {
      .medlink-page-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1.25rem;
        padding: 1.75rem 2rem;
      }
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .header-main {
        gap: 1.25rem;
      }
    }

    .header-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    @media (min-width: 640px) {
      .header-icon-badge {
        width: 3.25rem;
        height: 3.25rem;
        border-radius: var(--radius-lg);
      }
    }

    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
      width: fit-content;
    }

    .header-title {
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.25;
      letter-spacing: -0.025em;
      margin: 0;
      word-break: break-word;
    }

    @media (min-width: 640px) {
      .header-title {
        font-size: 1.5rem;
      }
    }

    @media (min-width: 768px) {
      .header-title {
        font-size: 1.625rem;
      }
    }

    .header-subtitle {
      font-size: 0.8125rem;
      line-height: 1.45;
      margin: 0;
      opacity: 0.9;
    }

    @media (min-width: 640px) {
      .header-subtitle {
        font-size: 0.9375rem;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex-wrap: wrap;
    }

    @media (max-width: 639px) {
      .header-actions {
        width: 100%;
      }
      .header-actions ::ng-deep .btn {
        width: 100%;
        justify-content: center;
      }
    }

    /* Role-based Theme Aesthetics (High Contrast & Distinct Palette) */
    .theme-patient {
      background: linear-gradient(135deg, #0A2540 0%, #0052A3 100%);
      color: #FFFFFF;
      border-color: rgba(0, 102, 204, 0.3);
      box-shadow: 0 10px 25px -5px rgba(10, 37, 64, 0.15);
    }
    .theme-patient .header-icon-badge {
      background: rgba(255, 255, 255, 0.15);
      color: #38BDF8;
      backdrop-filter: blur(8px);
    }
    .theme-patient .header-badge {
      background: rgba(56, 189, 248, 0.2);
      color: #7DD3FC;
      border: 1px solid rgba(56, 189, 248, 0.4);
    }
    .theme-patient .header-title { color: #FFFFFF; }
    .theme-patient .header-subtitle { color: #E0F2FE; }

    .theme-doctor {
      background: linear-gradient(135deg, #064E3B 0%, #00A389 100%);
      color: #FFFFFF;
      border-color: rgba(0, 163, 137, 0.3);
      box-shadow: 0 10px 25px -5px rgba(0, 163, 137, 0.2);
    }
    .theme-doctor .header-icon-badge {
      background: rgba(255, 255, 255, 0.18);
      color: #A7F3D0;
      backdrop-filter: blur(8px);
    }
    .theme-doctor .header-badge {
      background: rgba(167, 243, 208, 0.2);
      color: #D1FAE5;
      border: 1px solid rgba(167, 243, 208, 0.4);
    }
    .theme-doctor .header-title { color: #FFFFFF; }
    .theme-doctor .header-subtitle { color: #ECFDF5; }

    .theme-admin {
      background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
      color: #FFFFFF;
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 10px 25px -5px rgba(30, 27, 75, 0.25);
    }
    .theme-admin .header-icon-badge {
      background: rgba(255, 255, 255, 0.15);
      color: #C7D2FE;
      backdrop-filter: blur(8px);
    }
    .theme-admin .header-badge {
      background: rgba(199, 210, 254, 0.2);
      color: #E0E7FF;
      border: 1px solid rgba(199, 210, 254, 0.4);
    }
    .theme-admin .header-title { color: #FFFFFF; }
    .theme-admin .header-subtitle { color: #EEF2FF; }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() role: 'patient' | 'doctor' | 'admin' | 'general' = 'patient';
  @Input() badge: string = '';
}
