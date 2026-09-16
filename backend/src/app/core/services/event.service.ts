import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventModel } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/events`;

  // The Authorization header is added automatically by the AuthInterceptor,
  // so no token handling is needed here.

  getEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.baseUrl);
  }

  getEventById(id: string | number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.baseUrl}/${id}`);
  }

  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(this.baseUrl, event);
  }

  updateEvent(id: string | number, event: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
