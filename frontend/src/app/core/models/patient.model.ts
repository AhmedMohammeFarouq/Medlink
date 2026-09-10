import { User } from './user.model';

export type BloodType = 
  | 'A_POSITIVE' | 'A_NEGATIVE' 
  | 'B_POSITIVE' | 'B_NEGATIVE' 
  | 'AB_POSITIVE' | 'AB_NEGATIVE' 
  | 'O_POSITIVE' | 'O_NEGATIVE' 
  | 'UNKNOWN';

export interface Allergy {
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  reaction?: string;
}

export interface ChronicCondition {
  name: string;
  diagnosedAt?: Date | string;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  _id: string;
  userId: string | User;
  healthId?: string;
  dateOfBirth?: Date | string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType: BloodType;
  height?: number;
  weight?: number;
  allergies?: Allergy[];
  chronicConditions?: ChronicCondition[];
  emergencyContact?: EmergencyContact;
  createdAt?: string;
  updatedAt?: string;
}
