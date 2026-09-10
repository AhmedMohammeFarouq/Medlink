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
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, IconComponent, AppLogoComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.css'
})
export class DoctorLayoutComponent {
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
    { label: 'menu.overview', icon: 'dashboard', route: '/doctor/dashboard' },
    { label: 'menu.appointments', icon: 'calendar', route: '/doctor/appointments' },
    { label: 'menu.patients', icon: 'users', route: '/doctor/patients' },
    { label: 'menu.encounters', icon: 'file-text', route: '/doctor/encounters' },
    { label: 'menu.prescriptions', icon: 'pill', route: '/doctor/prescriptions' },
    { label: 'menu.schedule', icon: 'clock', route: '/doctor/schedule' },
    { label: 'menu.follow_ups', icon: 'bell', route: '/doctor/follow-ups' },
    { label: 'menu.messages', icon: 'message-square', route: '/doctor/chat' },
    { label: 'menu.profile', icon: 'user', route: '/doctor/profile' },
    { label: 'menu.settings', icon: 'settings', route: '/doctor/settings' },
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
