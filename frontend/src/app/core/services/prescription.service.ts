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

  getPrescriptionById(id: string): Observable<ApiResponse<Prescription>> {
    return this.http.get<ApiResponse<Prescription>>(`${this.baseUrl}${API_ENDPOINTS.prescriptions.byId(id)}`);
  }

  createPrescription(data: Partial<Prescription>): Observable<ApiResponse<Prescription>> {
    return this.http.post<ApiResponse<Prescription>>(`${this.baseUrl}${API_ENDPOINTS.prescriptions.base}`, data);
  }
}
