import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="link" class="medlink-logo" [class.logo-sm]="size === 'sm'" [class.logo-lg]="size === 'lg'">
      <div class="logo-mark">
        <svg class="logo-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
          <path d="M16 8V24M8 16H24" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="21" cy="11" r="2.5" fill="#00E5B3" />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0A2540" />
              <stop offset="1" stop-color="#0066CC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      @if (showText) {
        <div class="logo-text-wrap">
          <span class="logo-wordmark">MED<span class="logo-accent">LINK</span></span>
          @if (tagline) {
            <span class="logo-tagline">{{ tagline }}</span>
          }
        </div>
      }
    </a>
  `,
  styles: [`
    .medlink-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      user-select: none;
    }
    .logo-mark {
      width: 2.25rem;
      height: 2.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 6px rgba(0, 102, 204, 0.25));
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .medlink-logo:hover .logo-mark {
      transform: scale(1.05);
    }
    .logo-icon-svg {
      width: 100%;
      height: 100%;
    }
    .logo-text-wrap {
      display: flex;
      flex-direction: column;
    }
    .logo-wordmark {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.035em;
      color: var(--primary-dark, #0A2540);
      line-height: 1;
    }
    .logo-accent {
      color: var(--secondary, #00A389);
    }
    .logo-tagline {
      font-size: 0.625rem;
      font-weight: 700;
      color: var(--text-muted, #64748B);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 0.15rem;
    }

    /* Size variants */
    .logo-sm .logo-mark { width: 1.75rem; height: 1.75rem; }
    .logo-sm .logo-wordmark { font-size: 1.1rem; }
    .logo-lg .logo-mark { width: 3rem; height: 3rem; }
    .logo-lg .logo-wordmark { font-size: 1.75rem; }
  `]
})
export class AppLogoComponent {
  @Input() link: string = '/';
  @Input() showText: boolean = true;
  @Input() tagline?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
