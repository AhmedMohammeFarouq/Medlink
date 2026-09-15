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

export type DoctorVerificationStatus =
  | 'PENDING'
  | 'DOCUMENTS_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface DoctorVerification {
  status: DoctorVerificationStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  documents?: string[];
}

export type DoctorProfileStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface Doctor {
  _id: string;
  userId: string | User;
  professionalInfo: DoctorProfessionalInfo;
  clinics?: DoctorClinicAffiliation[];
  // Real backend fields (Doctor.verification / Doctor.rating) — used by Admin doctor verification.
  verification?: DoctorVerification;
  profileStatus?: DoctorProfileStatus;
  // NOTE: kept for backward compatibility with existing patient-facing doctor listing
  // components (e.g. doctor-card) which read `rating` as a plain number and `reviewsCount`.
  // Do not repurpose these for the Admin verification flow — use `verification`/`ratingInfo`.
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  ratingInfo?: { average: number; count: number };
  createdAt?: string;
  updatedAt?: string;
}
