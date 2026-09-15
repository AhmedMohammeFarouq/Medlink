import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatConversation } from '../../../core/models/chat.model';
import { ChatMessage } from '../../../core/models/message.model';
import { MessageBubbleComponent } from '../../../shared/components/message-bubble/message-bubble.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageBubbleComponent, EmptyStateComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class DoctorChatComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  conversations: ChatConversation[] = [];
  selectedConversation: ChatConversation | null = null;
  messages: ChatMessage[] = [];
  newMessageText = '';
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.isLoading = true;
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.conversations = res.data || [];
        if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        }
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  selectConversation(conv: ChatConversation): void {
    this.selectedConversation = conv;
    this.chatService.getMessages(conv._id).subscribe({
      next: (res) => {
        this.messages = res.data || [];
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.selectedConversation) return;

    const content = this.newMessageText.trim();
    this.newMessageText = '';

    this.chatService.sendMessage(this.selectedConversation._id, content).subscribe({
      next: (res) => {
        if (res.data) {
          this.messages.push(res.data);
        }
      }
    });
  }
}
