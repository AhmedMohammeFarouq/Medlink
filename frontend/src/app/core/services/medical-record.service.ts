import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { MedicalRecord } from '../models/medical-record.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getRecords(): Observable<ApiResponse<MedicalRecord[]>> {
    return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.base}`);
  }

  getRecordById(id: string): Observable<ApiResponse<MedicalRecord>> {
    return this.http.get<ApiResponse<MedicalRecord>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.byId(id)}`);
  }

  getPatientRecords(patientId: string): Observable<ApiResponse<MedicalRecord[]>> {
    return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.patientRecords(patientId)}`);
  }
}
