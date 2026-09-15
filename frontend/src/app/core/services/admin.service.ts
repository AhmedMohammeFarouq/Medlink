import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { Doctor } from '../models/doctor.model';

export interface AdminStatistics {
  registeredPatients: number;
  registeredDoctors: number;
  totalAppointments: number;
  completedAppointments: number;
  activeUsers: number;
  bookingCompletionRate: number;
  medicalRecordUsage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // --------------------------------------------------------------------------
  // Doctor Verification (/admin/doctors/*)
  // Backend does not populate userId -> callers should resolve applicant
  // name/email separately via UserService.getUserById(doctor.userId).
  // --------------------------------------------------------------------------

  getPendingDoctors(): Observable<ApiResponse<Doctor[]>> {
    return this.http.get<ApiResponse<Doctor[]>>(
      `${this.baseUrl}${API_ENDPOINTS.admin.doctors.pending}`
    );
  }

  getDoctorById(doctorId: string): Observable<ApiResponse<Doctor>> {
    return this.http.get<ApiResponse<Doctor>>(
      `${this.baseUrl}${API_ENDPOINTS.admin.doctors.byId(doctorId)}`
    );
  }

  approveDoctor(doctorId: string): Observable<ApiResponse<Doctor>> {
    return this.http.patch<ApiResponse<Doctor>>(
      `${this.baseUrl}${API_ENDPOINTS.admin.doctors.approve(doctorId)}`,
      {}
    );
  }

  rejectDoctor(doctorId: string, reason: string): Observable<ApiResponse<Doctor>> {
    return this.http.patch<ApiResponse<Doctor>>(
      `${this.baseUrl}${API_ENDPOINTS.admin.doctors.reject(doctorId)}`,
      { reason }
    );
  }

  // --------------------------------------------------------------------------
  // Statistics (/admin/statistics)
  // --------------------------------------------------------------------------

  getBasicStatistics(): Observable<ApiResponse<AdminStatistics>> {
    return this.http.get<ApiResponse<AdminStatistics>>(
      `${this.baseUrl}${API_ENDPOINTS.admin.statistics}`
    );
  }
}
