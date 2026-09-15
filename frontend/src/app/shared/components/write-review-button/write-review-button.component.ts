import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { ReviewService } from '../../../core/services/review.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { User } from '../../../core/models/user.model';
import { ModalComponent } from '../modal/modal.component';
import { IconComponent } from '../icon/icon.component';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

interface ReviewableDoctorInfo {
  name: string;
  phone: string;
}

/**
 * Self-contained "Write a Review" trigger + modal.
 *
 * Loads the patient's own appointments, lets them pick a COMPLETED
 * consultation (defaulting to the most recent one), and submits a
 * rating/comment via ReviewService. Drop <app-write-review-button>
 * into any patient-facing page (dashboard, appointments, etc.) without
 * duplicating the review flow.
 */
@Component({
  selector: 'app-write-review-button',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, IconComponent, RatingStarsComponent],
  templateUrl: './write-review-button.component.html',
  styleUrl: './write-review-button.component.css'
})
export class WriteReviewButtonComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private reviewService = inject(ReviewService);

  // Visual variant of the trigger: a small outline button (for toolbars/
  // page headers) or a full quick-action card (for dashboard grids).
  @Input() variant: 'button' | 'card' = 'button';

  appointments: Appointment[] = [];
  isLoadingAppointments = false;

  isReviewModalOpen = false;
  isChoosingAlternateDoctor = false;

  reviewTargetAppointment: Appointment | null = null;
  doctorInfoCache: Record<string, ReviewableDoctorInfo> = {};
  isResolvingDoctorInfo = false;

  reviewRating = 0;
  reviewComment = '';
  isSubmittingReview = false;
  reviewSuccessMessage: string | null = null;
  reviewErrorMessage: string | null = null;

  get completedAppointments(): Appointment[] {
    return this.appointments
      .filter((a) => a.status === 'COMPLETED')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }

  get alternateCompletedAppointments(): Appointment[] {
    return this.completedAppointments.filter((a) => a._id !== this.reviewTargetAppointment?._id);
  }

  get reviewTargetDoctorId(): string | null {
    const doc = this.reviewTargetAppointment?.doctorId;
    if (!doc) return null;
    return typeof doc === 'string' ? doc : (doc as any)._id;
  }

  get reviewTargetDoctorInfo(): ReviewableDoctorInfo | null {
    const id = this.reviewTargetDoctorId;
    return id ? this.doctorInfoCache[id] || null : null;
  }

  ngOnInit(): void {
    // Load quietly in the background so the button/card is ready to use
    // the moment the patient clicks it, without blocking page render.
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (res) => {
        this.isLoadingAppointments = false;
        this.appointments = res.data || [];
      },
      error: () => {
        this.isLoadingAppointments = false;
        this.appointments = [];
      }
    });
  }

  openWriteReview(): void {
    this.isReviewModalOpen = true;
    this.isChoosingAlternateDoctor = false;
    this.reviewRating = 0;
    this.reviewComment = '';
    this.reviewSuccessMessage = null;
    this.reviewErrorMessage = null;

    // If appointments haven't resolved yet (e.g. clicked immediately on
    // page load), fetch them now rather than showing an empty state.
    if (this.appointments.length === 0 && !this.isLoadingAppointments) {
      this.loadAppointments();
    }

    const latest = this.completedAppointments[0] || null;
    this.reviewTargetAppointment = latest;
    if (latest) {
      this.resolveDoctorInfoFor(latest);
    }
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
  }

  chooseAlternateDoctor(): void {
    this.isChoosingAlternateDoctor = true;
  }

  selectAlternateAppointment(appt: Appointment): void {
    this.reviewTargetAppointment = appt;
    this.isChoosingAlternateDoctor = false;
    this.resolveDoctorInfoFor(appt);
  }

  private resolveDoctorInfoFor(appt: Appointment): void {
    const doc = appt.doctorId;
    if (!doc) return;

    // Already populated by the backend on the appointment itself.
    if (typeof doc === 'object') {
      const d = doc as any;
      const name = d.userId && typeof d.userId === 'object'
        ? `${d.userId.firstName} ${d.userId.lastName}`
        : (d.firstName ? `${d.firstName} ${d.lastName}` : null);
      const phone = (d.userId && typeof d.userId === 'object' ? d.userId.phone : d.phone) || '';
      if (name) {
        this.doctorInfoCache[d._id] = { name: `Dr. ${name}`, phone };
        return;
      }
    }

    const doctorId = typeof doc === 'string' ? doc : (doc as any)._id;
    if (!doctorId || this.doctorInfoCache[doctorId]) return;

    // Patient-accessible doctor lookup (same endpoint used by doctor
    // browsing/profile pages) — a PATIENT-role token isn't authorized
    // to call the admin-only /users/:id endpoint.
    this.isResolvingDoctorInfo = true;
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (res) => {
        this.isResolvingDoctorInfo = false;
        const d = res.data as Doctor | undefined;
        if (!d) return;
        const u = d.userId as User | string;
        const name = typeof u === 'object' ? `Dr. ${u.firstName} ${u.lastName}` : 'Dr. Specialist';
        const phone = typeof u === 'object' ? (u.phone || '') : '';
        this.doctorInfoCache[doctorId] = { name, phone };
      },
      error: () => {
        this.isResolvingDoctorInfo = false;
        this.doctorInfoCache[doctorId] = { name: 'Your doctor', phone: '' };
      }
    });
  }

  submitReview(): void {
    if (this.isSubmittingReview) return;

    if (!this.reviewTargetAppointment) {
      this.reviewErrorMessage = 'Please select a completed consultation to review.';
      return;
    }
    if (!this.reviewRating || this.reviewRating < 1 || this.reviewRating > 5) {
      this.reviewErrorMessage = 'Please select a star rating between 1 and 5.';
      return;
    }

    const doctorId = this.reviewTargetDoctorId;
    if (!doctorId) {
      this.reviewErrorMessage = 'Could not determine the doctor for this consultation.';
      return;
    }

    this.isSubmittingReview = true;
    this.reviewErrorMessage = null;

    this.reviewService.createReview({
      doctorId,
      appointmentId: this.reviewTargetAppointment._id,
      rating: this.reviewRating,
      comment: this.reviewComment.trim() || undefined
    }).subscribe({
      next: () => {
        this.isSubmittingReview = false;
        this.reviewSuccessMessage = 'Your review has been submitted successfully.';
        setTimeout(() => {
          this.isReviewModalOpen = false;
          this.reviewSuccessMessage = null;
        }, 1500);
      },
      error: (err) => {
        this.isSubmittingReview = false;
        if (err.status === 409) {
          this.reviewErrorMessage = 'You have already reviewed this consultation.';
        } else if (err.status === 401 || err.status === 403) {
          this.reviewErrorMessage = 'You must be signed in as the patient from this consultation to leave a review.';
        } else {
          this.reviewErrorMessage = err.message || 'Failed to submit review. Please try again.';
        }
      }
    });
  }
}
