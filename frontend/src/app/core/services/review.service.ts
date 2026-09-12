import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { DoctorReview } from '../models/review.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getReviews(): Observable<ApiResponse<DoctorReview[]>> {
    return this.http.get<ApiResponse<DoctorReview[]>>(`${this.baseUrl}${API_ENDPOINTS.reviews.base}`);
  }

  createReview(data: Partial<DoctorReview>): Observable<ApiResponse<DoctorReview>> {
    return this.http.post<ApiResponse<DoctorReview>>(`${this.baseUrl}${API_ENDPOINTS.reviews.base}`, data);
  }
}
