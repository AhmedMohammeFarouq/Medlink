import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Encounter, CreateEncounterPayload, EncounterStatus } from '../models/encounter.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
 
  createEncounter(data: CreateEncounterPayload): Observable<ApiResponse<Encounter>> {
    return this.http.post<ApiResponse<Encounter>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.base}`,
      data
    );
  }
 
  getEncountersByPatient(patientId: string): Observable<ApiResponse<Encounter[]>> {
    return this.http.get<ApiResponse<Encounter[]>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.byPatientId(patientId)}`
    );
  }

  getEncountersByDoctor(doctorId: string): Observable<ApiResponse<Encounter[]>> {
    return this.http.get<ApiResponse<Encounter[]>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.byDoctorId(doctorId)}`
    );
  }
 
  getEncounterById(id: string): Observable<ApiResponse<Encounter>> {
    return this.http.get<ApiResponse<Encounter>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.byId(id)}`
    );
  }
 
  updateEncounter(id: string, data: Partial<Encounter>): Observable<ApiResponse<Encounter>> {
    return this.http.patch<ApiResponse<Encounter>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.byId(id)}`,
      data
    );
  }
 
  updateEncounterStatus(id: string, statusData: { status: EncounterStatus }): Observable<ApiResponse<Encounter>> {
    return this.http.patch<ApiResponse<Encounter>>(
      `${this.baseUrl}${API_ENDPOINTS.encounters.updateStatus(id)}`,
      statusData
    );
  }
}
 