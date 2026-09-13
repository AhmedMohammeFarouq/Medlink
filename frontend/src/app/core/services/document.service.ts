import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { MedicalDocument } from '../models/document.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getDocuments(): Observable<ApiResponse<MedicalDocument[]>> {
    return this.http.get<ApiResponse<MedicalDocument[]>>(`${this.baseUrl}${API_ENDPOINTS.documents.base}`);
  }

  getDocumentById(id: string): Observable<ApiResponse<MedicalDocument>> {
    return this.http.get<ApiResponse<MedicalDocument>>(`${this.baseUrl}${API_ENDPOINTS.documents.byId(id)}`);
  }

  uploadDocument(formData: FormData): Observable<ApiResponse<MedicalDocument>> {
    return this.http.post<ApiResponse<MedicalDocument>>(`${this.baseUrl}${API_ENDPOINTS.documents.upload}`, formData);
  }

  deleteDocument(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.documents.byId(id)}`);
  }
}
