export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface MessageAttachment {
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
  sizeInBytes?: number | null;
}

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: string;
  messageType: MessageType;
  content: string;
  attachments: MessageAttachment[];
  readAt?: string | Date | null;
  createdAt: string | Date;
}
