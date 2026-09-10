import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.pattern(/^01[0125][0-9]{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    gender: ['MALE'],
    dateOfBirth: ['']
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const val = this.registerForm.value;
    const payload: any = {
      firstName: val.firstName!.trim(),
      lastName: val.lastName!.trim(),
      email: val.email!.trim(),
      password: val.password!
    };

    if (val.phone && val.phone.trim()) {
      payload.phone = val.phone.trim();
    }
    if (val.gender) {
      payload.gender = val.gender;
    }
    if (val.dateOfBirth) {
      payload.dateOfBirth = val.dateOfBirth;
    }

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          // Navigate to email verification screen with email prefilled
          this.router.navigate(['/verify-account'], { queryParams: { email: payload.email } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}
