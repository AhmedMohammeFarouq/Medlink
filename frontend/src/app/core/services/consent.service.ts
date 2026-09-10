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

  getConsents(): Observable<ApiResponse<ConsentRequest[]>> {
    return this.http.get<ApiResponse<ConsentRequest[]>>(`${this.baseUrl}${API_ENDPOINTS.consent.base}`);
  }

  grantConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(`${this.baseUrl}${API_ENDPOINTS.consent.byId(id)}/grant`, {});
  }

  revokeConsent(id: string): Observable<ApiResponse<ConsentRequest>> {
    return this.http.patch<ApiResponse<ConsentRequest>>(`${this.baseUrl}${API_ENDPOINTS.consent.byId(id)}/revoke`, {});
  }
}
