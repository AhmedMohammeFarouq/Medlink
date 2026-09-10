import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';
import { AppLogoComponent } from '../logo/logo.component';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() items: NavItem[] = [];
  @Input() portalTitle: string = 'Portal';
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  translationService = inject(TranslationService);
  
  currentUser = this.authService.currentUser;
  currentLang = this.translationService.currentLang;

  onNavigate(): void {
    this.closeSidebar.emit();
  }

  logout(): void {
    this.closeSidebar.emit();
    this.authService.logout();
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}
