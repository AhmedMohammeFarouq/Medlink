export interface ConsentRequest {
  _id: string;
  patientId: string;
  patientHealthId?: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialty?: string;
  purpose: string;
  requestedPermissions: string[];
  startDate: string | Date;
  expirationDate: string | Date;
  status: 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED';
  createdAt?: string;
}
