import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';
import { AppLogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  private router = inject(Router);
  
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  currentLang = this.translationService.currentLang;
  
  isMobileMenuOpen = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }

  get dashboardLink(): string {
    return this.authService.getDashboardRouteForRole();
  }
}
