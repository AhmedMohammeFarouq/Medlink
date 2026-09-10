export interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Encounter {
  _id: string;
  appointmentId?: string;
  patientId: string | any;
  doctorId: string | any;
  date: string | Date;
  chiefComplaint: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  vitals?: VitalSigns;
  diagnoses?: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'AMENDED';
  createdAt?: string;
  updatedAt?: string;
}
