import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { CHAT_SOCKET_EVENTS } from '../constants/chat-events';
import { ChatRoom } from '../models/chat.model';
import { ChatMessage, MessageAttachment, MessageType } from '../models/message.model';
import { ApiResponse } from '../models/api-response.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);
  private baseUrl = environment.apiUrl;

  // ---- REST calls ----
  // We use plain HTTP for anything that is a one-time fetch (room list,
  // message history), because that data needs to be there on page load,
  // before a socket connection even exists yet.

  createOrGetRoom(patientId: string, doctorId: string, appointmentId?: string | null): Observable<ApiResponse<ChatRoom>> {
    return this.http.post<ApiResponse<ChatRoom>>(`${this.baseUrl}${API_ENDPOINTS.chat.createRoom}`, {
      patientId,
      doctorId,
      appointmentId
    });
  }

  getMyRooms(): Observable<ApiResponse<ChatRoom[]>> {
    return this.http.get<ApiResponse<ChatRoom[]>>(`${this.baseUrl}${API_ENDPOINTS.chat.myRooms}`);
  }

  getRoom(roomId: string): Observable<ApiResponse<ChatRoom>> {
    return this.http.get<ApiResponse<ChatRoom>>(`${this.baseUrl}${API_ENDPOINTS.chat.roomById(roomId)}`);
  }

  closeRoom(roomId: string): Observable<ApiResponse<ChatRoom>> {
    return this.http.patch<ApiResponse<ChatRoom>>(`${this.baseUrl}${API_ENDPOINTS.chat.closeRoom(roomId)}`, {});
  }

  getMessages(roomId: string): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.baseUrl}${API_ENDPOINTS.chat.messages(roomId)}`);
  }

  // ---- Socket calls ----
  // Everything that needs to feel "live" - sending a message, typing status,
  // read receipts - goes over the socket instead, matching chat.socket.js.

  connectSocket(): void {
    this.socketService.connect();
  }

  disconnectSocket(): void {
    this.socketService.disconnect();
  }

  joinRoom(roomId: string): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.JOIN_ROOM, { roomId });
  }

  leaveRoom(roomId: string): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.LEAVE_ROOM, { roomId });
  }

  sendMessage(roomId: string, content: string, messageType: MessageType = 'text', attachments: MessageAttachment[] = []): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.SEND_MESSAGE, {
      roomId,
      content,
      messageType,
      attachments
    });
  }

  startTyping(roomId: string): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.TYPING_START, { roomId });
  }

  stopTyping(roomId: string): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.TYPING_STOP, { roomId });
  }

  markAsRead(roomId: string): void {
    this.socketService.emit(CHAT_SOCKET_EVENTS.MARK_READ, { roomId });
  }

  onNewMessage(callback: (message: ChatMessage) => void): void {
    this.socketService.on<ChatMessage>(CHAT_SOCKET_EVENTS.NEW_MESSAGE, callback);
  }

  onMessageRead(callback: (data: { roomId: string; messageIds: string[]; readBy: string }) => void): void {
    this.socketService.on(CHAT_SOCKET_EVENTS.MESSAGE_READ, callback);
  }

  onUserTyping(callback: (data: { roomId: string; userId: string }) => void): void {
    this.socketService.on(CHAT_SOCKET_EVENTS.USER_TYPING, callback);
  }

  onUserStoppedTyping(callback: (data: { roomId: string; userId: string }) => void): void {
    this.socketService.on(CHAT_SOCKET_EVENTS.USER_STOPPED_TYPING, callback);
  }

  onRoomJoined(callback: (data: { roomId: string }) => void): void {
    this.socketService.on(CHAT_SOCKET_EVENTS.ROOM_JOINED, callback);
  }

  onError(callback: (data: { message: string }) => void): void {
    this.socketService.on(CHAT_SOCKET_EVENTS.ERROR, callback);
  }
}
