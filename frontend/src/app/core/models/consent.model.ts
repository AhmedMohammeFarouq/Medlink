export interface ConsentRequest {
doctorName: any;
doctorSpecialty: any;
purpose: any;
requestedPermissions: any;
expirationDate: string|Date|null|undefined;
  _id: string;
  patientId: string;
  doctorId: { _id: string; name?: string; specialty?: string } | string;
  grantedTo: string;
  grantedBy: string;
  type: 'MEDICAL_RECORD_ACCESS' | 'DOCUMENT_ACCESS' | 'PRESCRIPTION_ACCESS' | 'CHAT_ACCESS' | 'FULL_ACCESS' | 'OTHER';
  scope: string[];
  status: 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'REJECTED';
  reason?: string | null;
  grantedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  revocationReason?: string | null;
  createdAt?: string;
}