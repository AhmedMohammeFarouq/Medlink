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
