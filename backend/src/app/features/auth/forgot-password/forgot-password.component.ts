import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  resetToken: string | null = null;

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.infoMessage = null;

    const email = this.forgotForm.value.email!.trim();

    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.infoMessage = res.message || 'If this email exists, a password reset token has been issued.';
        if (res.data?.resetToken) {
          this.resetToken = res.data.resetToken;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to submit password reset request.';
      }
    });
  }

  proceedToReset(): void {
    if (this.resetToken) {
      this.router.navigate(['/reset-password'], { queryParams: { token: this.resetToken } });
    }
  }
}
