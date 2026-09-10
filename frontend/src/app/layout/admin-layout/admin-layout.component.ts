import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent, NavItem } from '../../shared/components/sidebar/sidebar.component';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, IconComponent, AppLogoComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  translationService = inject(TranslationService);
  authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  currentLang = this.translationService.currentLang;

  isSidebarOpen = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebar();
    });
  }

  navItems: NavItem[] = [
    { label: 'menu.overview', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'menu.users', icon: 'users', route: '/admin/users' },
    { label: 'menu.doctor_verification', icon: 'user-check', route: '/admin/doctor-verification' },
    { label: 'menu.clinics', icon: 'building', route: '/admin/clinics' },
    { label: 'menu.audit_logs', icon: 'file-text', route: '/admin/audit-logs' },
    { label: 'menu.complaints', icon: 'alert-triangle', route: '/admin/complaints' },
    { label: 'menu.statistics', icon: 'bar-chart', route: '/admin/statistics' },
    { label: 'menu.settings', icon: 'settings', route: '/admin/settings' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}

