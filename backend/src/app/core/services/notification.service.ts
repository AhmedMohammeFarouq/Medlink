import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AppNotification } from '../models/notification.model';
import { ApiResponse } from '../models/api-response.model';

// notification.controller.js's listMyNotifications does NOT use the shared
// { success, data } envelope like every other endpoint - it returns
// { success, notifications } instead. So this response shape is modeled
// separately rather than reusing ApiResponse<T>.
export interface NotificationListResponse {
  success: boolean;
  notifications: AppNotification[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getNotifications(unreadOnly: boolean = false): Observable<NotificationListResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.notifications.base}?unreadOnly=${unreadOnly}`;
    return this.http.get<NotificationListResponse>(url);
  }

  markAsRead(id: string): Observable<ApiResponse<AppNotification>> {
    return this.http.patch<ApiResponse<AppNotification>>(`${this.baseUrl}${API_ENDPOINTS.notifications.markRead(id)}`, {});
  }

  markAllAsRead(): Observable<ApiResponse<AppNotification[]>> {
    return this.http.patch<ApiResponse<AppNotification[]>>(`${this.baseUrl}${API_ENDPOINTS.notifications.markAllRead}`, {});
  }
}
