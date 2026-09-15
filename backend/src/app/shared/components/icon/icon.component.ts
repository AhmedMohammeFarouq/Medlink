import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="faClass; else svgTpl">
      <i [class]="faClass + ' ' + customClass" [class.icon-flip]="flipOnRtl" [style.font-size.px]="size" [style.color]="color || 'currentColor'"></i>
    </ng-container>
    <ng-template #svgTpl>
      <svg 
        [attr.width]="size" 
        [attr.height]="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        [attr.stroke]="color || 'currentColor'" 
        [attr.stroke-width]="strokeWidth" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        [class]="'lucide-icon ' + customClass"
        [class.icon-flip]="flipOnRtl"
        [innerHTML]="svgPaths">
      </svg>
    </ng-template>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      vertical-align: middle;
    }
    .lucide-icon, i {
      flex-shrink: 0;
      transition: stroke 0.15s ease, color 0.15s ease, transform 0.15s ease;
    }
    :host-context(body.is-rtl) .icon-flip {
      transform: scaleX(-1);
    }
  `]
})
export class IconComponent {
  @Input() name: string = 'circle';
  @Input() size: number | string = 20;
  @Input() strokeWidth: number | string = 2;
  @Input() color: string = '';
  @Input() customClass: string = '';
  @Input() flipOnRtl: boolean = false;

  get faClass(): string | null {
    const faMap: Record<string, string> = {
      'activity': 'fa-solid fa-chart-line',
      'stethoscope': 'fa-solid fa-stethoscope',
      'pill': 'fa-solid fa-pills',
      'heart-pulse': 'fa-solid fa-heart-pulse',
      'cross': 'fa-solid fa-user-nurse',
      'shield': 'fa-solid fa-shield-halved',
      'shield-check': 'fa-solid fa-shield-cat',
      'lock': 'fa-solid fa-lock',
      'unlock': 'fa-solid fa-lock-open',
      'dashboard': 'fa-solid fa-chart-pie',
      'calendar': 'fa-solid fa-calendar-days',
      'clock': 'fa-solid fa-clock',
      'users': 'fa-solid fa-users',
      'user': 'fa-solid fa-user',
      'user-check': 'fa-solid fa-user-check',
      'user-plus': 'fa-solid fa-user-plus',
      'folder': 'fa-solid fa-folder-open',
      'file-text': 'fa-solid fa-file-medical',
      'bell': 'fa-solid fa-bell',
      'message-square': 'fa-solid fa-comments',
      'settings': 'fa-solid fa-gear',
      'log-out': 'fa-solid fa-right-from-bracket',
      'log-in': 'fa-solid fa-right-to-bracket',
      'search': 'fa-solid fa-magnifying-glass',
      'check': 'fa-solid fa-check',
      'check-circle': 'fa-solid fa-circle-check',
      'alert-circle': 'fa-solid fa-circle-exclamation',
      'info': 'fa-solid fa-circle-info',
      'arrow-right': 'fa-solid fa-arrow-right',
      'arrow-left': 'fa-solid fa-arrow-left',
      'chevron-down': 'fa-solid fa-chevron-down',
      'chevron-right': 'fa-solid fa-chevron-right',
      'chevron-left': 'fa-solid fa-chevron-left',
      'menu': 'fa-solid fa-bars',
      'x': 'fa-solid fa-xmark',
      'globe': 'fa-solid fa-globe',
      'sparkles': 'fa-solid fa-wand-magic-sparkles',
      'star': 'fa-solid fa-star',
      'phone': 'fa-solid fa-phone',
      'mail': 'fa-solid fa-envelope',
      'refresh': 'fa-solid fa-arrows-rotate',
      'edit': 'fa-solid fa-pen-to-square',
      'trash': 'fa-solid fa-trash-can',
      'eye': 'fa-solid fa-eye',
      'upload': 'fa-solid fa-cloud-arrow-up',
      'download': 'fa-solid fa-cloud-arrow-down',
      'shield-alert': 'fa-solid fa-shield-virus',
      'building': 'fa-solid fa-hospital',
      'bar-chart': 'fa-solid fa-chart-column',
      'analytics': 'fa-solid fa-chart-simple',
      'plus': 'fa-solid fa-plus',
      'filter': 'fa-solid fa-filter',
      'alert-triangle': 'fa-solid fa-triangle-exclamation',
      'external-link': 'fa-solid fa-arrow-up-right-from-square'
    };

    if (this.name && this.name.startsWith('fa-')) {
      return this.name;
    }
    return faMap[this.name] || null;
  }

  get svgPaths(): string {
    const icons: Record<string, string> = {
      'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      'stethoscope': '<path d="M4.5 3h3a2.5 2.5 0 0 1 2.5 2.5v4a5 5 0 0 0 10 0v-4a2.5 2.5 0 0 1 2.5-2.5h0"/><path d="M6 3v5a6 6 0 0 0 12 0V3"/><circle cx="18" cy="18" r="3"/><path d="M10 10v4a2 2 0 0 0 4 0v-4"/>',
      'pill': '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
      'heart-pulse': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27"/>',
      'circle': '<circle cx="12" cy="12" r="10"/>'
    };

    return icons[this.name] || icons['circle'];
  }
}
