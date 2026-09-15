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

  getConsents(patientId: string): Observable<ApiResponse<ConsentRequest[]>> {
    return this.http.get<ApiResponse<ConsentRequest[]>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.base}/patient/${patientId}`
    );
  }

  // جديد: الدكتور بيبعت طلب consent للمريض
  requestConsent(patientId: string, type: string, scope: string[], reason?: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.post<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.base}/request`,
      { patientId, type, scope, reason }
    );
  }

  grantConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.byId(id)}/approve`, {}
    );
  }

  // جديد: المريض يرفض
  rejectConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.byId(id)}/reject`, {}
    );
  }

  revokeConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(
      `${this.baseUrl}${API_ENDPOINTS.consent.byId(id)}/revoke`, {}
    );
  }
}