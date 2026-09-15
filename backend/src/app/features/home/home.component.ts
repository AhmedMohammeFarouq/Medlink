import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private translationService = inject(TranslationService);
  
  isAuthenticated = this.authService.isAuthenticated;
  currentLang = this.translationService.currentLang;

  get startLink(): string {
    return this.isAuthenticated() 
      ? this.authService.getDashboardRouteForRole() 
      : '/register';
  }

  get doctorLink(): string {
    return this.isAuthenticated() 
      ? this.authService.getDashboardRouteForRole() 
      : '/login';
  }
}
