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

  getPatients(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<ApiResponse<Patient[]>>(`${this.baseUrl}${API_ENDPOINTS.patients.base}`);
  }

  getPatientById(id: string): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<Patient>>(`${this.baseUrl}${API_ENDPOINTS.patients.byId(id)}`);
  }

  getPatientProfile(): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<Patient>>(`${this.baseUrl}${API_ENDPOINTS.patients.profile}`);
  }
}
