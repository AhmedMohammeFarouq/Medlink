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
export class PatientNotificationsComponent implements OnInit {
  private notifService = inject(NotificationService);

  notifications: AppNotification[] = [];
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notifService.getNotifications().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notifications = res.data || [];
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
        notif.isRead = true;
      }
    });
  }

  markAllAsRead(): void {
    this.notifService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
      }
    });
  }
}
