import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css'
})
export class VerifyAccountComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  isResending = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  verifyForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParams['email'];
    if (emailParam) {
      this.verifyForm.patchValue({ email: emailParam });
    }
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload = {
      email: this.verifyForm.value.email!.trim(),
      code: this.verifyForm.value.code!.trim()
    };

    this.authService.verifyEmail(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const role = res.data.user.role;
          const target = this.authService.getDashboardRouteForRole(role);
          this.router.navigate([target]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Verification failed. Please check the 6-digit code.';
      }
    });
  }

  resendCode(): void {
    const email = this.verifyForm.value.email?.trim();
    if (!email) {
      this.errorMessage = 'Please provide your email address to resend the code.';
      return;
    }

    this.isResending = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.resendVerification({ email }).subscribe({
      next: (res) => {
        this.isResending = false;
        this.successMessage = res.message || 'Verification code resent successfully.';
      },
      error: (err) => {
        this.isResending = false;
        this.errorMessage = err.message || 'Failed to resend verification code.';
      }
    });
  }
}
