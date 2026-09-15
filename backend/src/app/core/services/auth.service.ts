import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ROLES, AppRole } from '../constants/roles';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  VerifyEmailRequest, 
  ResendVerificationRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  AuthTokens 
} from '../models/auth.model';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { StorageUtil } from '../utils/storage.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiUrl;

  // Reactive state via Angular Signals
  currentUser = signal<User | null>(StorageUtil.getUser<User>());
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);

  constructor() {
    // If token exists but no user in memory, we maintain the current user from storage
    const storedUser = StorageUtil.getUser<User>();
    if (storedUser) {
      this.currentUser.set(storedUser);
    }
  }

  register(data: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.register}`,
      data
    );
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.login}`,
      credentials
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.handleAuthSuccess(res.data.user, res.data.tokens);
        }
      })
    );
  }

  verifyEmail(data: VerifyEmailRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.verifyEmail}`,
      data
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.handleAuthSuccess(res.data.user, res.data.tokens);
        }
      })
    );
  }

  resendVerification(data: ResendVerificationRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.resendVerification}`,
      data
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponse<{ resetToken?: string }>> {
    return this.http.post<ApiResponse<{ resetToken?: string }>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.forgotPassword}`,
      data
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.resetPassword}`,
      data
    );
  }

  refreshToken(): Observable<ApiResponse<AuthTokens>> {
    const refreshToken = StorageUtil.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<AuthTokens>>(
      `${this.baseUrl}${API_ENDPOINTS.auth.refreshToken}`,
      { refreshToken }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          StorageUtil.setAccessToken(res.data.accessToken);
          StorageUtil.setRefreshToken(res.data.refreshToken);
        }
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    const refreshToken = StorageUtil.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.baseUrl}${API_ENDPOINTS.auth.logout}`, { refreshToken })
        .subscribe({ error: () => {} });
    }
    StorageUtil.clearAuth();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  updateCurrentUserInState(user: User): void {
    StorageUtil.setUser(user);
    this.currentUser.set(user);
  }

  private handleAuthSuccess(user: User, tokens: AuthTokens): void {
    StorageUtil.setAccessToken(tokens.accessToken);
    StorageUtil.setRefreshToken(tokens.refreshToken);
    StorageUtil.setUser(user);
    this.currentUser.set(user);
  }

  getDashboardRouteForRole(role?: AppRole | null): string {
    const r = role || this.userRole();
    switch (r) {
      case ROLES.PATIENT:
        return '/patient/dashboard';
      case ROLES.DOCTOR:
        return '/doctor/dashboard';
      case ROLES.SYSTEM_ADMIN:
        return '/admin/dashboard';
      case ROLES.CLINIC_ADMIN:
      case ROLES.RECEPTIONIST:
        return '/patient/dashboard';
      default:
        return '/login';
    }
  }
}
