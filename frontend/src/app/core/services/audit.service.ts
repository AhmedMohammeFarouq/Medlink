import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { AuditLog, AuditLogFilters, PaginatedResult } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getLogs(filters?: AuditLogFilters): Observable<ApiResponse<PaginatedResult<AuditLog>>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.actorId) params = params.set('actorId', filters.actorId);
      if (filters.action) params = params.set('action', filters.action);
      if (filters.resourceType) params = params.set('resourceType', filters.resourceType);
      if (filters.resourceId) params = params.set('resourceId', filters.resourceId);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<ApiResponse<PaginatedResult<AuditLog>>>(
      `${this.baseUrl}${API_ENDPOINTS.audit.base}`,
      { params }
    );
  }

  getLogById(auditId: string): Observable<ApiResponse<AuditLog>> {
    return this.http.get<ApiResponse<AuditLog>>(
      `${this.baseUrl}${API_ENDPOINTS.audit.byId(auditId)}`
    );
  }
}
