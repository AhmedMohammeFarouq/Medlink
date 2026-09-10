import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, BookAppointmentDto } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppointmentCardComponent, EmptyStateComponent, ModalComponent, PageHeaderComponent, IconComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);

  appointments: Appointment[] = [];
  isLoading = true;
  isBackendModulePending = false;
  isBookingModalOpen = false;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  bookForm = this.fb.group({
    doctorId: ['', [Validators.required]],
    scheduledAt: ['', [Validators.required]],
    type: ['IN_PERSON'],
    reason: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.appointments = res.data || [];
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404 || err.status === 500) {
          // Backend module route not registered in router yet
          this.isBackendModulePending = true;
        } else {
          this.errorMessage = err.message;
        }
      }
    });
  }

  openBookingModal(): void {
    this.isBookingModalOpen = true;
  }

  bookAppointment(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.bookForm.value;
    const dto: BookAppointmentDto = {
      doctorId: val.doctorId!,
      scheduledAt: val.scheduledAt!,
      type: val.type as any,
      reason: val.reason!
    };

    this.appointmentService.bookAppointment(dto).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isBookingModalOpen = false;
        this.successMessage = 'Appointment booked successfully.';
        this.loadAppointments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Failed to book appointment.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  cancelAppointment(appt: Appointment): void {
    this.appointmentService.cancelAppointment(appt._id).subscribe({
      next: () => {
        this.successMessage = 'Appointment cancelled.';
        this.loadAppointments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Could not cancel appointment.';
      }
    });
  }
}
