import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent, NavItem } from '../../shared/components/sidebar/sidebar.component';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService } from '../../core/services/auth.service';
import { UnreadBadgesService } from '../../core/services/unread-badges.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, IconComponent, AppLogoComponent],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css'
})
export class PatientLayoutComponent {
  translationService = inject(TranslationService);
  authService = inject(AuthService);
  badgesService = inject(UnreadBadgesService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  currentLang = this.translationService.currentLang;

  isSidebarOpen = signal<boolean>(false);

  constructor() {
    this.badgesService.initialize();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.closeSidebar();

      // Clear the relevant badge once the user actually visits the page -
      // otherwise the count would just keep growing forever.
      const url = (event as NavigationEnd).urlAfterRedirects;
      if (url.startsWith('/patient/chat')) {
        this.badgesService.resetMessagesCount();
      } else if (url.startsWith('/patient/notifications')) {
        this.badgesService.resetNotificationsCount();
      }
    });
  }

  navItems = computed<NavItem[]>(() => [
    { label: 'menu.overview', icon: 'dashboard', route: '/patient/dashboard' },
    { label: 'menu.appointments', icon: 'calendar', route: '/patient/appointments' },
    { label: 'menu.find_doctors', icon: 'search', route: '/patient/doctors' },
    { label: 'menu.medical_records', icon: 'folder', route: '/patient/medical-records' },
    { label: 'menu.prescriptions', icon: 'pill', route: '/patient/prescriptions' },
    { label: 'menu.documents', icon: 'file-text', route: '/patient/documents' },
    { label: 'menu.consent', icon: 'shield-check', route: '/patient/consent' },
    { label: 'menu.notifications', icon: 'bell', route: '/patient/notifications', badge: this.badgesService.unreadNotificationsCount() || undefined },
    { label: 'menu.messages', icon: 'message-square', route: '/patient/chat', badge: this.badgesService.unreadMessagesCount() || undefined },
    { label: 'menu.profile', icon: 'user', route: '/patient/profile' },
    { label: 'menu.settings', icon: 'settings', route: '/patient/settings' },
  ]);

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
