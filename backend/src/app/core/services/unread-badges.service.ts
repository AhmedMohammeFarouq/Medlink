import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { NotificationService } from './notification.service';
import { SocketService } from './socket.service';

// This service exists because the sidebar's "Messages" and "Notifications"
// nav items support a badge count (see NavItem.badge in sidebar.component.ts)
// but nothing was ever feeding it a live number. It seeds each count once
// from the REST APIs, then keeps them updated in real time via the socket
// events the backend already emits (chat:newMessage, notification:new).
//
// Honesty about a limitation: the backend's /chat/rooms/myRooms endpoint
// does not return an unread-message count, so "unread messages" here means
// "messages that arrived while I was not on the chat page", counted from
// the moment this service connects - not the true all-time unread count
// you'd get from a dedicated backend endpoint. Good enough for a live
// badge, not a source of truth for anything else.
@Injectable({
  providedIn: 'root'
})
export class UnreadBadgesService {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private notificationService = inject(NotificationService);
  private socketService = inject(SocketService);

  unreadNotificationsCount = signal(0);
  unreadMessagesCount = signal(0);

  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    this.socketService.connect();
    this.seedNotificationsCount();
    this.registerListeners();
  }

  resetMessagesCount(): void {
    this.unreadMessagesCount.set(0);
  }

  resetNotificationsCount(): void {
    this.unreadNotificationsCount.set(0);
  }

  private seedNotificationsCount(): void {
    this.notificationService.getNotifications(true).subscribe({
      next: (res) => {
        this.unreadNotificationsCount.set(res.notifications?.length || 0);
      },
      error: (err) => {
        console.error('Failed to load unread notifications count:', err);
      }
    });
  }

  private registerListeners(): void {
    // notification:new is emitted by notification.service.js's pushNotification()
    // to the user's own socket room (user:<userId>) - it is not part of the
    // chat feature's own event set, so we listen for it directly instead of
    // going through ChatService.
    this.socketService.on('notification:new', () => {
      this.unreadNotificationsCount.update((count) => count + 1);
    });

    this.chatService.onNewMessage((message) => {
      const myUserId = this.authService.currentUser()?._id;

      // Every open tab (including the sender's own) receives this event -
      // see the comment in chat.component.ts's sendMessage(). We only want
      // to count messages that came FROM someone else.
      if (message.senderId !== myUserId) {
        this.unreadMessagesCount.update((count) => count + 1);
      }
    });
  }
}
