import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/models/appointment.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, StatusLabelPipe],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent {
  @Input({ required: true }) appointment!: Appointment;
  @Input() showActions: boolean = true;
  @Output() cancel = new EventEmitter<Appointment>();
  @Output() viewDetails = new EventEmitter<Appointment>();

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'COMPLETED': return 'badge-primary';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }
}
