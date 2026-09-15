import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { WriteReviewButtonComponent } from '../../../shared/components/write-review-button/write-review-button.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DateFormatPipe, TranslatePipe, IconComponent, PageHeaderComponent, WriteReviewButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class PatientDashboardComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
