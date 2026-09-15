export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderRole?: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string | Date;
}
