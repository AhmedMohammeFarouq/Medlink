import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ConsentRequest } from '../models/consent.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getConsents(patientId?: string): Observable<ApiResponse<ConsentRequest[]>> {
    const url = patientId
      ? `${this.baseUrl}${API_ENDPOINTS.consent.patientConsents(patientId)}`
      : `${this.baseUrl}${API_ENDPOINTS.consent.base}`;
    return this.http.get<ApiResponse<ConsentRequest[]>>(url);
  }

  requestConsent(patientId: string, type: string, scope: string[], reason?: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.post<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.request}`,
      { patientId, type, scope, reason }
    );
  }

  grantConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.approve(id)}`, {}
    );
  }

  approveConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.grantConsent(id);
  }

  rejectConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.reject(id)}`, {}
    );
  }

  revokeConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.revoke(id)}`, {}
    );
  }
}
