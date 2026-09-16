import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UpdateProfileDto } from '../../../core/models/user.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DoctorService } from '../../../core/services/doctor.service';
@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateFormatPipe, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class DoctorProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private fb = inject(FormBuilder);

  user: User | null = null;
  doctor: any = null;
isDoctorSaving = false;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isEditModalOpen = false;
  isPasswordModalOpen = false;
  isSaving = false;
  selectedFile: File | null = null;

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    phone: [''],
    gender: ['MALE'],
    dateOfBirth: ['']
  });
doctorForm = this.fb.group({
  specialty: ['', Validators.required],
  medicalDegree: [''],
  yearsOfExperience: [0],
  licenseNumber: ['', Validators.required],
  bio: ['']
});
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

 ngOnInit(): void {
  this.loadProfile();
  this.loadDoctorProfile();
}
// loadDoctorProfile(): void {
//   this.doctorService.getDoctorProfile().subscribe({
//     next: (res) => {
//       if (res.success && res.data) {
//         this.doctor = res.data;

// this.doctorForm.patchValue({
//   specialty: res.data.professionalInfo?.specialty || '',
//   medicalDegree: res.data.professionalInfo?.medicalDegree || '',
//   yearsOfExperience: res.data.professionalInfo?.yearsOfExperience || 0,
//   licenseNumber: res.data.professionalInfo?.licenseNumber || '',
//   bio: res.data.professionalInfo?.bio || ''
// });
//       }
//     },
//     error: (err) => {
//       console.error('Failed to load doctor profile:', err);
//     }
//   });
// }
loadDoctorProfile(): void {
  this.doctorService.getDoctorProfile().subscribe({
    next: (res) => {
      console.log('DOCTOR PROFILE RESPONSE:', res);

      if (res.success && res.data) {
        this.doctor = res.data;

        this.doctorForm.patchValue({
          specialty: res.data.professionalInfo?.specialty || '',
          medicalDegree: res.data.professionalInfo?.medicalDegree || '',
          yearsOfExperience: res.data.professionalInfo?.yearsOfExperience || 0,
          licenseNumber: res.data.professionalInfo?.licenseNumber || '',
          bio: res.data.professionalInfo?.bio || ''
        });
      }
    },

    error: (err) => {
      console.error('DOCTOR PROFILE ERROR:', err);
    }
  });
}
  loadProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.user = res.data;
          this.authService.updateCurrentUserInState(res.data);
          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phone: res.data.phone || '',
            gender: (res.data.gender as any) || 'MALE',
            dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth).toISOString().split('T')[0] : ''
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load doctor profile.';
      }
    });
  }

  openEditModal(): void {
    this.isEditModalOpen = true;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const dto: UpdateProfileDto = {
      firstName: this.profileForm.value.firstName!.trim(),
      lastName: this.profileForm.value.lastName!.trim(),
      phone: this.profileForm.value.phone?.trim() || undefined,
      gender: this.profileForm.value.gender as any,
      dateOfBirth: this.profileForm.value.dateOfBirth || undefined
    };

    this.userService.updateProfile(dto, this.selectedFile || undefined).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.isEditModalOpen = false;
        this.successMessage = 'Doctor profile updated successfully!';
        if (res.data) {
          this.user = res.data;
          this.authService.updateCurrentUserInState(res.data);
        }
        setTimeout(() => this.successMessage = null, 4000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to update profile.';
        setTimeout(() => this.errorMessage = null, 4000);
      }
    });
  }
submitVerification(): void {
    console.log('SUBMIT CLICKED');
  
  if (!this.doctor || this.doctorForm.invalid) {
    this.doctorForm.markAllAsTouched();
    
    return;
  }

  this.isDoctorSaving = true;

  const data = {
    professionalInfo: {
      specialty: this.doctorForm.value.specialty,
      medicalDegree: this.doctorForm.value.medicalDegree,
      yearsOfExperience: this.doctorForm.value.yearsOfExperience,
      licenseNumber: this.doctorForm.value.licenseNumber,
      bio: this.doctorForm.value.bio
    }
  };

this.doctorService.updateDoctor(this.doctor._id, data).subscribe({
  next: (res) => {
    console.log('UPDATE DOCTOR RESPONSE:', res);

    this.isDoctorSaving = false;

    if (res.success && res.data) {
      this.doctor = res.data;
    }

    this.successMessage = 'Credentials submitted for admin review.';

    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  },

  error: (err) => {
    console.error('UPDATE DOCTOR ERROR:', err);

    this.isDoctorSaving = false;

    this.errorMessage =
      err.message || 'Failed to submit credentials.';

    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }
});
}
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = {
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!
    };

    this.userService.changePassword(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isPasswordModalOpen = false;
        this.passwordForm.reset();
        this.successMessage = 'Password updated successfully.';
        setTimeout(() => this.successMessage = null, 4000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to change password.';
        setTimeout(() => this.errorMessage = null, 4000);
      }
    });
  }
}
