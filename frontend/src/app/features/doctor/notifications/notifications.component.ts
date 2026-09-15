import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification.model';
import { NotificationCardComponent } from '../../../shared/components/notification-card/notification-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-notifications',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent, EmptyStateComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class DoctorNotificationsComponent implements OnInit {
  private notifService = inject(NotificationService);

  notifications: AppNotification[] = [];
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    // Note: this endpoint returns { success, notifications }, not the usual
    // { success, data } envelope - see NotificationService for why.
    this.notifService.getNotifications().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notifications = res.notifications || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  onMarkRead(notif: AppNotification): void {
    this.notifService.markAsRead(notif._id).subscribe({
      next: () => {
        notif.notificationStatus = 'read';
      }
    });
  }

  markAllAsRead(): void {
    this.notifService.markAllAsRead().subscribe({
      next: () => {
        for (const notification of this.notifications) {
          notification.notificationStatus = 'read';
        }
      }
    });
  }
}
