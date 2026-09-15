import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Encounter } from '../models/encounter.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getEncounters(): Observable<ApiResponse<Encounter[]>> {
    return this.http.get<ApiResponse<Encounter[]>>(`${this.baseUrl}${API_ENDPOINTS.encounters.base}`);
  }

  getEncounterById(id: string): Observable<ApiResponse<Encounter>> {
    return this.http.get<ApiResponse<Encounter>>(`${this.baseUrl}${API_ENDPOINTS.encounters.byId(id)}`);
  }

  createEncounter(data: Partial<Encounter>): Observable<ApiResponse<Encounter>> {
    return this.http.post<ApiResponse<Encounter>>(`${this.baseUrl}${API_ENDPOINTS.encounters.base}`, data);
  }
}
