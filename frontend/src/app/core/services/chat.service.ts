import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ChatConversation } from '../models/chat.model';
import { ChatMessage } from '../models/message.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getConversations(): Observable<ApiResponse<ChatConversation[]>> {
    return this.http.get<ApiResponse<ChatConversation[]>>(`${this.baseUrl}${API_ENDPOINTS.chat.conversations}`);
  }

  getMessages(conversationId: string): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.baseUrl}${API_ENDPOINTS.chat.messages(conversationId)}`);
  }

  sendMessage(conversationId: string, content: string): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.baseUrl}${API_ENDPOINTS.chat.messages(conversationId)}`, { content });
  }
}
