export type NotificationType =
  | 'appointment_created'
  | 'appointment_updated'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'new_message'
  | 'prescription_created'
  | 'consent_updated'
  | 'follow_up_scheduled'
  | 'follow_up_due';

export type NotificationStatus = 'unread' | 'read';

export interface AppNotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: { [key: string]: any };
  notificationStatus: NotificationStatus;
  readAt?: string | Date | null;
  createdAt: string | Date;
}
