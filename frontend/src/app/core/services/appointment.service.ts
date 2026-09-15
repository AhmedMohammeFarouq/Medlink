import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Appointment, BookAppointmentDto } from '../models/appointment.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.baseUrl}${API_ENDPOINTS.appointments.base}`);
  }

  getMyAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.baseUrl}${API_ENDPOINTS.appointments.myAppointments}`);
  }

  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.baseUrl}${API_ENDPOINTS.appointments.byId(id)}`);
  }

  bookAppointment(data: BookAppointmentDto): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(`${this.baseUrl}${API_ENDPOINTS.appointments.base}`, data);
  }

  cancelAppointment(id: string, reason?: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}${API_ENDPOINTS.appointments.cancel(id)}`, { reason });
  }

  confirmAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}${API_ENDPOINTS.appointments.confirm(id)}`, {});
  }
}
