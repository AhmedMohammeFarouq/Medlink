import { User } from './user.model';

export interface DoctorProfessionalInfo {
  medicalDegree?: string;
  specialty: string;
  subSpecialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
  languages?: string[];
}

export interface DoctorClinicAffiliation {
  clinicId: string;
  consultationFee?: number;
  appointmentDuration?: number;
}

export interface Doctor {
  _id: string;
  userId: string | User;
  professionalInfo: DoctorProfessionalInfo;
  clinics?: DoctorClinicAffiliation[];
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ConsentType =
  | 'MEDICAL_RECORD_ACCESS'
  | 'DOCUMENT_ACCESS'
  | 'PRESCRIPTION_ACCESS'
  | 'CHAT_ACCESS'
  | 'FULL_ACCESS'
  | 'OTHER';

export type ConsentScope =
  | 'MEDICAL_RECORDS'
  | 'DOCUMENTS'
  | 'PRESCRIPTIONS'
  | 'APPOINTMENTS'
  | 'ENCOUNTERS'
  | 'PROFILE'
  | 'CHAT';

export const CONSENT_TYPES: ConsentType[] = [
  'MEDICAL_RECORD_ACCESS', 'DOCUMENT_ACCESS', 'PRESCRIPTION_ACCESS',
  'CHAT_ACCESS', 'FULL_ACCESS', 'OTHER',
];

export const CONSENT_SCOPES: ConsentScope[] = [
  'MEDICAL_RECORDS', 'DOCUMENTS', 'PRESCRIPTIONS',
  'APPOINTMENTS', 'ENCOUNTERS', 'PROFILE', 'CHAT',
];

export interface CreateConsentPayload {
  patientId: string;
  doctorId: string;
  grantedBy: string;
  grantedTo: string;
  type: ConsentType;
  scope: ConsentScope[];
  reason?: string;
  expiresAt?: string;
}

export interface CreatedConsentResponse {
  _id: string;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt?: string;
}
