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

  // 1. Get Medical Record by Patient ID (GET)
  getMedicalRecordByPatientId(patientId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}${API_ENDPOINTS.medicalRecords.getByPatientId(patientId)}`
    );
  }

  // 2. Update Medical Record (PATCH)
  updateMedicalRecord(patientId: string, data: { diagnosis?: string; treatmentPlan?: string; notes?: string }): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.baseUrl}${API_ENDPOINTS.medicalRecords.updateByPatientId(patientId)}`,
      data
    );
  }

  // 3. Add Allergy to Patient (POST)
  addAllergy(patientId: string, allergyData: { name: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}${API_ENDPOINTS.medicalRecords.addAllergy(patientId)}`,
      allergyData
    )
  }



  // getRecords(): Observable<ApiResponse<MedicalRecord[]>> {
  //   return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.base}`);
  // }

  // getRecordById(id: string): Observable<ApiResponse<MedicalRecord>> {
  //   return this.http.get<ApiResponse<MedicalRecord>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.byId(id)}`);
  // }

  // getPatientRecords(patientId: string): Observable<ApiResponse<MedicalRecord[]>> {
  //   return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.baseUrl}${API_ENDPOINTS.medicalRecords.patientRecords(patientId)}`);
  // }
}
