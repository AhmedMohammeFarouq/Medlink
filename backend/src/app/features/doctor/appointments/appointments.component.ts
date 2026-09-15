import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, AppointmentCardComponent, EmptyStateComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class DoctorAppointmentsComponent implements OnInit {
  private apptService = inject(AppointmentService);

  appointments: Appointment[] = [];
  isLoading = true;
  isBackendModulePending = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.apptService.getAppointments().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.appointments = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  confirmAppointment(appt: Appointment): void {
    this.apptService.confirmAppointment(appt._id).subscribe({
      next: () => {
        this.successMessage = 'Appointment confirmed.';
        this.loadAppointments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  cancelAppointment(appt: Appointment): void {
    this.apptService.cancelAppointment(appt._id).subscribe({
      next: () => {
        this.successMessage = 'Appointment cancelled.';
        this.loadAppointments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => this.errorMessage = err.message
    });
  }
}
