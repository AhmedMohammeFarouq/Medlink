export type EncounterType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'ONLINE' | 'IN_PERSON';
export type EncounterStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Severity = 'MILD' | 'MODERATE' | 'SEVERE';

export interface Symptom {
  name?: string;
  duration?: string;
  severity?: Severity;
}

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  systolicBloodPressure?: number;
  diastolicBloodPressure?: number;
  oxygenSaturation?: number;
}

export interface Examination {
  generalCondition?: string;
  vitalSigns?: VitalSigns;
  findings?: string;
}

export interface Diagnosis {
  name?: string;
  code?: string;
  type?: 'PRIMARY' | 'SECONDARY';
  notes?: string;
}

export interface FollowUp {
  required?: boolean;
  date?: string | Date | null;
  notes?: string;
}

export interface Encounter {
  _id: string;
  patientId: string | any;
  doctorId: string | any;
  appointmentId?: string | null;
  medicalRecordId: string | any;
  clinicId?: string | null;
  type: EncounterType;
  status: EncounterStatus;
  startedAt?: string | Date | null;
  endedAt?: string | Date | null;
  chiefComplaint?: string;
  symptoms?: Symptom[];
  clinicalNotes?: string;
  examination?: Examination;
  diagnosis?: Diagnosis[];
  treatmentPlan?: string;
  followUp?: FollowUp;
  prescriptions?: string[];
  documents?: string[];
  createdBy: string | any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEncounterPayload {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  type?: EncounterType;
  chiefComplaint?: string;
  symptoms?: Symptom[];
  treatmentPlan?: string;
  clinicalNotes?: string;
}