import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { DoctorReview, CreateReviewDto, UpdateReviewDto, ReviewFilters } from '../models/review.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginatedResult } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private buildParams(filters?: ReviewFilters): HttpParams {
    let params = new HttpParams();
    if (filters) {
      if (filters.doctorId) params = params.set('doctorId', filters.doctorId);
      if (filters.patientId) params = params.set('patientId', filters.patientId);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return params;
  }

  getReviews(filters?: ReviewFilters): Observable<ApiResponse<PaginatedResult<DoctorReview>>> {
    return this.http.get<ApiResponse<PaginatedResult<DoctorReview>>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.base}`,
      { params: this.buildParams(filters) }
    );
  }

  getReviewsForDoctor(doctorId: string, page = 1, limit = 20): Observable<ApiResponse<PaginatedResult<DoctorReview>>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<ApiResponse<PaginatedResult<DoctorReview>>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.forDoctor(doctorId)}`,
      { params }
    );
  }

  getReviewById(reviewId: string): Observable<ApiResponse<DoctorReview>> {
    return this.http.get<ApiResponse<DoctorReview>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.byId(reviewId)}`
    );
  }

  createReview(data: CreateReviewDto): Observable<ApiResponse<DoctorReview>> {
    return this.http.post<ApiResponse<DoctorReview>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.base}`,
      data
    );
  }

  updateReview(reviewId: string, data: UpdateReviewDto): Observable<ApiResponse<DoctorReview>> {
    return this.http.patch<ApiResponse<DoctorReview>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.byId(reviewId)}`,
      data
    );
  }

  // Admin moderation convenience wrapper (hide a review without deleting it).
  setReviewStatus(reviewId: string, status: 'ACTIVE' | 'HIDDEN'): Observable<ApiResponse<DoctorReview>> {
    return this.updateReview(reviewId, { status });
  }

  deleteReview(reviewId: string): Observable<ApiResponse<DoctorReview>> {
    return this.http.delete<ApiResponse<DoctorReview>>(
      `${this.baseUrl}${API_ENDPOINTS.reviews.byId(reviewId)}`
    );
  }
}
