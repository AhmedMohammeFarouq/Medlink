export interface ConsentRequest {
  _id: string;
  patientId: string;
  patientHealthId?: string;
  doctorId: any;
  doctorName?: string;
  doctorSpecialty?: string;
  grantedTo?: string;
  grantedBy?: string;
  type?: 'MEDICAL_RECORD_ACCESS' | 'DOCUMENT_ACCESS' | 'PRESCRIPTION_ACCESS' | 'CHAT_ACCESS' | 'FULL_ACCESS' | 'OTHER' | string;
  scope?: string[];
  purpose?: string;
  requestedPermissions?: string[];
  reason?: string | null;
  startDate?: string | Date;
  expirationDate?: string | Date | null;
  expiresAt?: string | null;
  grantedAt?: string | null;
  revokedAt?: string | null;
  revocationReason?: string | null;
  status: 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}
