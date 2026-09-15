import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { UserSession } from '../../../core/models/session.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-doctor-settings',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, ConfirmDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class DoctorSettingsComponent implements OnInit {
  private userService = inject(UserService);

  sessions: UserSession[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isConfirmOpen = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmAction: (() => void) | null = null;

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.userService.getCurrentUserSessions().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.sessions = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load active sessions.';
      }
    });
  }

  revokeSession(session: UserSession): void {
    this.confirmTitle = 'Revoke Device Session';
    this.confirmMessage = `Are you sure you want to disconnect this device (${session.deviceInfo || session.ipAddress || 'Device'})?`;
    this.confirmAction = () => {
      this.userService.revokeCurrentUserSession(session._id).subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = 'Device session revoked.';
          this.loadSessions();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to revoke session.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  revokeAll(): void {
    this.confirmTitle = 'Disconnect All Devices';
    this.confirmMessage = 'Are you sure you want to revoke all active sessions across all devices? You will be signed out everywhere.';
    this.confirmAction = () => {
      this.userService.revokeAllCurrentUserSessions().subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = 'All active device sessions revoked.';
          this.loadSessions();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to revoke sessions.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  onConfirm(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
  }
}
