import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AppLogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe, IconComponent, AppLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage: string | null = null;
  needsEmailVerification = false;
  unverifiedEmail = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.needsEmailVerification = false;

    const credentials = {
      email: this.loginForm.value.email!.trim(),
      password: this.loginForm.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            const role = res.data.user.role;
            const targetRoute = this.authService.getDashboardRouteForRole(role);
            this.router.navigate([targetRoute]);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Login failed. Please check your credentials.';
        if (this.errorMessage?.toLowerCase().includes('email verification required')) {
          this.needsEmailVerification = true;
          this.unverifiedEmail = credentials.email;
        }
      }
    });
  }
}
