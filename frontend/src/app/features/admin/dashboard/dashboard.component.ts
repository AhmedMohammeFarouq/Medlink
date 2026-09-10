import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, IconComponent, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  totalUsers = 0;
  totalPatients = 0;
  totalDoctors = 0;
  totalPending = 0;
  isLoading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.userService.getUsers({ limit: 100 }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const list = res.data;
          this.totalUsers = res.meta?.total || list.length;
          this.totalPatients = list.filter(u => u.role === 'PATIENT').length;
          this.totalDoctors = list.filter(u => u.role === 'DOCTOR').length;
          this.totalPending = list.filter(u => u.status === 'PENDING').length;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
