import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatRoom } from '../../../core/models/chat.model';
import { ChatMessage } from '../../../core/models/message.model';
import { MessageBubbleComponent } from '../../../shared/components/message-bubble/message-bubble.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageBubbleComponent, EmptyStateComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class PatientChatComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  rooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  messages: ChatMessage[] = [];
  newMessageText = '';
  isLoading = true;
  typingUserId: string | null = null;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // We open the socket and attach listeners before loading rooms, so that
    // if a message arrives right after we join a room, we don't miss it.
    this.chatService.connectSocket();
    this.registerSocketListeners();
    this.loadRooms();
  }

  ngOnDestroy(): void {
    if (this.selectedRoom) {
      this.chatService.leaveRoom(this.selectedRoom._id);
    }
    this.chatService.disconnectSocket();
  }

  private registerSocketListeners(): void {
    this.chatService.onNewMessage((message) => {
      if (this.selectedRoom && message.roomId === this.selectedRoom._id) {
        this.messages.push(message);
        this.chatService.markAsRead(this.selectedRoom._id);
      }
    });

    this.chatService.onUserTyping((data) => {
      if (this.selectedRoom && data.roomId === this.selectedRoom._id) {
        this.typingUserId = data.userId;
      }
    });

    this.chatService.onUserStoppedTyping((data) => {
      if (this.selectedRoom && data.roomId === this.selectedRoom._id) {
        this.typingUserId = null;
      }
    });

    this.chatService.onMessageRead((data) => {
      if (this.selectedRoom && data.roomId === this.selectedRoom._id) {
        for (const message of this.messages) {
          if (data.messageIds.includes(message._id)) {
            message.readAt = new Date();
          }
        }
      }
    });

    this.chatService.onError((data) => {
      console.error(`Chat socket error: ${data.message}`);
    });
  }

  loadRooms(): void {
    this.isLoading = true;
    this.chatService.getMyRooms().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.rooms = res.data || [];
        if (this.rooms.length > 0) {
          this.selectRoom(this.rooms[0]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load chat rooms:', err);
      }
    });
  }

  selectRoom(room: ChatRoom): void {
    if (this.selectedRoom) {
      this.chatService.leaveRoom(this.selectedRoom._id);
    }

    this.selectedRoom = room;
    this.typingUserId = null;
    this.chatService.joinRoom(room._id);

    this.chatService.getMessages(room._id).subscribe({
      next: (res) => {
        this.messages = res.data || [];
        this.chatService.markAsRead(room._id);
      },
      error: (err) => {
        console.error('Failed to load messages:', err);
      }
    });
  }

  sendMessage(): void {
    const content = this.newMessageText.trim();
    if (!content || !this.selectedRoom) {
      return;
    }

    this.newMessageText = '';
    this.chatService.stopTyping(this.selectedRoom._id);

    // We do NOT push the message into this.messages here. The server
    // saves it and echoes it back on the NEW_MESSAGE socket event, so the
    // sender's own screen updates the same way every other participant's
    // does - one source of truth instead of two.
    this.chatService.sendMessage(this.selectedRoom._id, content);
  }

  onTyping(): void {
    if (!this.selectedRoom) {
      return;
    }

    this.chatService.startTyping(this.selectedRoom._id);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      if (this.selectedRoom) {
        this.chatService.stopTyping(this.selectedRoom._id);
      }
    }, 2000);
  }
}
