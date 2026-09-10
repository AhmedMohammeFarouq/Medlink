import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User, UpdateProfileDto, ChangePasswordDto } from '../models/user.model';
import { UserSession } from '../models/session.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationParams } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // --------------------------------------------------------------------------
  // Current User Operations (/users/me)
  // --------------------------------------------------------------------------

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.users.me}`);
  }

  updateProfile(data: UpdateProfileDto, profileImageFile?: File): Observable<ApiResponse<User>> {
    if (profileImageFile) {
      const formData = new FormData();
      formData.append('profileImage', profileImageFile);
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.phone) formData.append('phone', data.phone);
      if (data.gender) formData.append('gender', data.gender);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);

      return this.http.patch<ApiResponse<User>>(
        `${this.baseUrl}${API_ENDPOINTS.users.updateProfile}`,
        formData
      );
    }

    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}${API_ENDPOINTS.users.updateProfile}`,
      data
    );
  }

  changePassword(data: ChangePasswordDto): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}${API_ENDPOINTS.users.changePassword}`,
      data
    );
  }

  deleteCurrentUser(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.users.deleteAccount}`);
  }

  // --------------------------------------------------------------------------
  // Sessions & Devices (/users/me/sessions)
  // --------------------------------------------------------------------------

  getCurrentUserSessions(): Observable<ApiResponse<UserSession[]>> {
    return this.http.get<ApiResponse<UserSession[]>>(`${this.baseUrl}${API_ENDPOINTS.users.sessions}`);
  }

  revokeCurrentUserSession(sessionId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}${API_ENDPOINTS.users.revokeSession(sessionId)}`
    );
  }

  revokeAllCurrentUserSessions(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}${API_ENDPOINTS.users.revokeAllSessions}`
    );
  }

  // --------------------------------------------------------------------------
  // Admin User Management (/users)
  // --------------------------------------------------------------------------

  getUsers(params?: PaginationParams): Observable<ApiResponse<User[]>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.role) httpParams = httpParams.set('role', params.role);
      if (params.status) httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<ApiResponse<User[]>>(
      `${this.baseUrl}${API_ENDPOINTS.users.getAll}`,
      { params: httpParams }
    );
  }

  getUserById(userId: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.baseUrl}${API_ENDPOINTS.users.getById(userId)}`
    );
  }

  updateUserByAdmin(userId: string, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}${API_ENDPOINTS.users.updateByAdmin(userId)}`,
      data
    );
  }

  deleteUserByAdmin(userId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}${API_ENDPOINTS.users.deleteByAdmin(userId)}`
    );
  }

  restoreUserByAdmin(userId: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}${API_ENDPOINTS.users.restoreByAdmin(userId)}`,
      {}
    );
  }
}
