import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Patient } from '../models/patient.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // جلب قائمة المرضى (GET /patients)
  getPatients(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<ApiResponse<Patient[]>>(`${this.baseUrl}${API_ENDPOINTS.patients.base}`);
  }

  // جلب بروفايل المريض الحالي (GET /patients/me)
  getPatient(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<ApiResponse<Patient[]>>(`${this.baseUrl}${API_ENDPOINTS.patients.me}`);
  }

  getPatientById(id: string): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<Patient>>(`${this.baseUrl}${API_ENDPOINTS.patients.byId(id)}`);
  }

  getPatientProfile(): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<Patient>>(`${this.baseUrl}${API_ENDPOINTS.patients.profile}`);
  }

  // تحديث بروفايل المريض الحالي (PATCH /patients/me)
  updatePatientMe(data: Partial<Patient>): Observable<ApiResponse<Patient>> {
    return this.http.patch<ApiResponse<Patient>>(`${this.baseUrl}${API_ENDPOINTS.patients.me}`, data);
  }

  // جلب السجل الطبي للمريض (GET /patients/:id/medical-record)
  getPatientMedicalRecord(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.patients.medicalRecord(id)}`);
  }

  // جلب التايم لاين للمريض (GET /patients/:id/timeline)
  getPatientTimeline(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.patients.timeline(id)}`);
  }
}




