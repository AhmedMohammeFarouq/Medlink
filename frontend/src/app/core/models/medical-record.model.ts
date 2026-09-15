// export interface MedicalRecord {
//   _id: string;
//   patientId: string | any;
//   doctorId: string | any;
//   title: string;
//   category: 'LAB_RESULT' | 'PRESCRIPTION' | 'CLINICAL_NOTE' | 'IMAGING' | 'DISCHARGE_SUMMARY' | 'OTHER';
//   recordDate: string | Date;
//   summary?: string;
//   diagnosis?: string;
//   attachments?: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }
export type BloodType =
  | 'A_POSITIVE' | 'A_NEGATIVE'
  | 'B_POSITIVE' | 'B_NEGATIVE'
  | 'AB_POSITIVE' | 'AB_NEGATIVE'
  | 'O_POSITIVE' | 'O_NEGATIVE'
  | 'UNKNOWN';

export interface Allergy {
  _id?: string;
  name?: string;
  reaction?: string;
  severity?: 'MILD' | 'MODERATE' | 'SEVERE';
}

export interface ChronicCondition {
  _id?: string;
  name?: string;
  diagnosedAt?: string | Date;
  status?: 'ACTIVE' | 'RESOLVED' | 'CHRONIC' | 'INACTIVE';
  notes?: string;
}

export interface FamilyHistoryEntry {
  _id?: string;
  condition?: string;
  relationship?: string;
  notes?: string;
}

export interface SurgicalHistoryEntry {
  _id?: string;
  procedure?: string;
  date?: string | Date;
  hospital?: string;
  notes?: string;
}

export interface Lifestyle {
  smoking?: 'NEVER' | 'FORMER' | 'CURRENT' | 'UNKNOWN';
  alcohol?: 'NEVER' | 'FORMER' | 'CURRENT' | 'UNKNOWN';
  exercise?: string;
  diet?: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: string | any;
  bloodType: BloodType;
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  familyHistory: FamilyHistoryEntry[];
  surgicalHistory: SurgicalHistoryEntry[];
  lifestyle?: Lifestyle;
  notes?: string;
  lastUpdatedBy?: string | any;
  createdAt?: string;
  updatedAt?: string;
}