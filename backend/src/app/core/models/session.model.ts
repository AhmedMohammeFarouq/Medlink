export interface UserSession {
  _id: string;
  user: string;
  expiresAt: string | Date;
  revokedAt?: string | Date | null;
  lastUsedAt?: string | Date | null;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
