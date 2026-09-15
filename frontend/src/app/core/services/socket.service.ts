import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { StorageUtil } from '../utils/storage.util';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    // If we already have a live connection, reuse it instead of opening
    // a second one every time a component calls connect().
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = StorageUtil.getAccessToken();

    // environment.apiUrl is 'http://localhost:5000/api/v1' - that '/api/v1'
    // part is only the REST prefix (see routes/index.js on the backend).
    // Socket.IO's server is mounted on the raw http server, at the root,
    // so we have to strip that prefix off before connecting.
    const socketUrl = environment.apiUrl.replace('/api/v1', '');

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect_error', (error) => {
      console.error(`Socket connection failed: ${error.message}`);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, payload?: any): void {
    if (!this.socket) {
      console.error(`Cannot emit "${event}" - socket is not connected yet.`);
      return;
    }
    this.socket.emit(event, payload);
  }

  on<T = any>(event: string, callback: (data: T) => void): void {
    if (!this.socket) {
      console.error(`Cannot listen for "${event}" - socket is not connected yet.`);
      return;
    }
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) {
      return;
    }
    this.socket.off(event, callback);
  }
}
