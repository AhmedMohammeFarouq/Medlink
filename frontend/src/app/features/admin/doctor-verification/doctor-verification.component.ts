import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-verification',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, EmptyStateComponent],
  templateUrl: './doctor-verification.component.html',
  styleUrl: './doctor-verification.component.css'
})
export class DoctorVerificationComponent implements OnInit {
  private userService = inject(UserService);

  pendingDoctors: User[] = [];
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.userService.getUsers({ role: 'DOCTOR' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.pendingDoctors = res.data.filter(u => !u.isVerified);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  approveDoctor(doctor: User): void {
    this.userService.updateUserByAdmin(doctor._id, { isVerified: true, status: 'ACTIVE' }).subscribe({
      next: () => {
        this.successMessage = `Dr. ${doctor.firstName} ${doctor.lastName} verified successfully.`;
        this.loadDoctors();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => this.errorMessage = err.message
    });
  }
}
