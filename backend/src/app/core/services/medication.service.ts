import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Medication } from '../models/medication.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMedications(): Observable<ApiResponse<Medication[]>> {
    return this.http.get<ApiResponse<Medication[]>>(`${this.baseUrl}${API_ENDPOINTS.medications.base}`);
  }

  getMedicationById(id: string): Observable<ApiResponse<Medication>> {
    return this.http.get<ApiResponse<Medication>>(`${this.baseUrl}${API_ENDPOINTS.medications.byId(id)}`);
  }
}
