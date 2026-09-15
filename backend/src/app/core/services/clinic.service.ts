import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Clinic } from '../models/clinic.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getClinics(): Observable<ApiResponse<Clinic[]>> {
    return this.http.get<ApiResponse<Clinic[]>>(`${this.baseUrl}${API_ENDPOINTS.clinics.base}`);
  }

  getClinicById(id: string): Observable<ApiResponse<Clinic>> {
    return this.http.get<ApiResponse<Clinic>>(`${this.baseUrl}${API_ENDPOINTS.clinics.byId(id)}`);
  }
}
