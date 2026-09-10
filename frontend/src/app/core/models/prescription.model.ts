export interface PrescribedMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  notes?: string;
}

export interface Prescription {
  _id: string;
  prescriptionCode?: string;
  patientId: string | any;
  patientName?: string;
  patientHealthId?: string;
  doctorId: string | any;
  doctorName?: string;
  doctorSpecialty?: string;
  diagnosis?: string;
  medications: PrescribedMedication[];
  notes?: string;
  issueDate: string | Date;
  status: 'ACTIVE' | 'DISCONTINUED' | 'EXPIRED';
  createdAt?: string;
  updatedAt?: string;
}
