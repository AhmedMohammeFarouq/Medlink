import { ChatMessage } from './message.model';

export interface ChatConversation {
  _id: string;
  participants: string[];
  participantNames?: { [userId: string]: string };
  lastMessage?: ChatMessage;
  unreadCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
