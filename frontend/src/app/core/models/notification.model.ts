export interface AppNotification {
  _id: string;
  userId: string;
  category: 'APPOINTMENT' | 'PRESCRIPTION' | 'DOCUMENT' | 'CONSENT' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string | Date;
}
