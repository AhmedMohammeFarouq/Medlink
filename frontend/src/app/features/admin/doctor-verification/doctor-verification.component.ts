import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from '../../../core/services/admin.service';
import { UserService } from '../../../core/services/user.service';
import { Doctor } from '../../../core/models/doctor.model';
import { User } from '../../../core/models/user.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-doctor-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFormatPipe, EmptyStateComponent, ModalComponent, PageHeaderComponent, IconComponent],
  templateUrl: './doctor-verification.component.html',
  styleUrl: './doctor-verification.component.css'
})
export class DoctorVerificationComponent implements OnInit {
  private adminService = inject(AdminService);
  private userService = inject(UserService);

  pendingDoctors: Doctor[] = [];
  // The backend Doctor documents don't populate the linked User, so we
  // resolve applicant name/email separately and cache them here.
  applicants: Record<string, User> = {};

  isLoading = true;
  actionInFlightId: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Doctor details modal
  isDetailsModalOpen = false;
  selectedDoctor: Doctor | null = null;

  // Reject modal
  isRejectModalOpen = false;
  rejectTargetDoctor: Doctor | null = null;
  rejectReason = '';
  rejectError: string | null = null;

  ngOnInit(): void {
    this.loadDoctors();
  }

  private userIdOf(doctor: Doctor): string {
    const uid = doctor.userId;
    return typeof uid === 'string' ? uid : (uid as User)._id;
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getPendingDoctors().subscribe({
      next: (res) => {
        this.pendingDoctors = res.success && res.data ? res.data : [];
        this.resolveApplicants();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load pending doctor applications.';
      }
    });
  }

  private resolveApplicants(): void {
    const idsToFetch = Array.from(
      new Set(
        this.pendingDoctors
          .map((d) => this.userIdOf(d))
          .filter((id) => !!id && !this.applicants[id])
      )
    );

    if (idsToFetch.length === 0) {
      this.isLoading = false;
      return;
    }

    const requests = idsToFetch.map((id) =>
      this.userService.getUserById(id).pipe(
        map((res) => ({ id, user: res.data })),
        catchError(() => of({ id, user: null }))
      )
    );

    forkJoin(requests).subscribe((results) => {
      results.forEach((r) => {
        if (r.user) this.applicants[r.id] = r.user;
      });
      this.isLoading = false;
    });
  }

  applicantName(doctor: Doctor): string {
    const user = this.applicants[this.userIdOf(doctor)];
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown applicant';
  }

  applicantEmail(doctor: Doctor): string {
    return this.applicants[this.userIdOf(doctor)]?.email || '—';
  }

  applicantPhone(doctor: Doctor): string {
    return this.applicants[this.userIdOf(doctor)]?.phone || '—';
  }

  openDetails(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.isDetailsModalOpen = true;
  }

  approveDoctor(doctor: Doctor): void {
    this.actionInFlightId = doctor._id;
    this.adminService.approveDoctor(doctor._id).subscribe({
      next: () => {
        this.actionInFlightId = null;
        this.successMessage = `${this.applicantName(doctor)}'s credentials were approved.`;
        this.loadDoctors();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        this.actionInFlightId = null;
        this.errorMessage = err.message || 'Failed to approve doctor.';
        setTimeout(() => (this.errorMessage = null), 4000);
      }
    });
  }

  openReject(doctor: Doctor): void {
    this.rejectTargetDoctor = doctor;
    this.rejectReason = '';
    this.rejectError = null;
    this.isRejectModalOpen = true;
  }

  confirmReject(): void {
    if (!this.rejectTargetDoctor) return;
    if (!this.rejectReason.trim()) {
      this.rejectError = 'A rejection reason is required.';
      return;
    }

    const doctor = this.rejectTargetDoctor;
    this.actionInFlightId = doctor._id;
    this.adminService.rejectDoctor(doctor._id, this.rejectReason.trim()).subscribe({
      next: () => {
        this.actionInFlightId = null;
        this.isRejectModalOpen = false;
        this.successMessage = `${this.applicantName(doctor)}'s application was rejected.`;
        this.loadDoctors();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        this.actionInFlightId = null;
        this.rejectError = err.message || 'Failed to reject doctor.';
      }
    });
  }
}
