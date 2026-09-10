import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../../core/models/notification.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input({ required: true }) notification!: AppNotification;
  @Output() markRead = new EventEmitter<AppNotification>();
}
