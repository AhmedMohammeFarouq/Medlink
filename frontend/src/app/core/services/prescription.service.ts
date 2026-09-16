import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Prescription } from '../models/prescription.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getPrescriptions(): Observable<ApiResponse<Prescription[]>> {
    return this.http.get<ApiResponse<Prescription[]>>(`${this.baseUrl}${API_ENDPOINTS.prescriptions.base}`);
  }

  lookupPatient(phone: string): Observable<ApiResponse<{ patientName: string }>> {
    return this.http.get<ApiResponse<{ patientName: string }>>(
      `${this.baseUrl}${API_ENDPOINTS.prescriptions.base}/lookup-patient?phone=${encodeURIComponent(phone)}`
    );
  }

  getPrescriptionById(id: string): Observable<ApiResponse<Prescription>> {
    return this.http.get<ApiResponse<Prescription>>(`${this.baseUrl}${API_ENDPOINTS.prescriptions.byId(id)}`);
  }

  updatePrescriptionStatus(id: string, status: string): Observable<ApiResponse<Prescription>> {
    return this.http.patch<ApiResponse<Prescription>>(
      `${this.baseUrl}${API_ENDPOINTS.prescriptions.byId(id)}/status`,
      { status }
    );
  }

  createPrescription(data: Partial<Prescription>): Observable<ApiResponse<Prescription>> {
    return this.http.post<ApiResponse<Prescription>>(`${this.baseUrl}${API_ENDPOINTS.prescriptions.base}`, data);
  }
}
