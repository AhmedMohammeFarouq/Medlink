export interface MedicalRecord {
  _id: string;
  patientId: string | any;
  doctorId: string | any;
  title: string;
  category: 'LAB_RESULT' | 'PRESCRIPTION' | 'CLINICAL_NOTE' | 'IMAGING' | 'DISCHARGE_SUMMARY' | 'OTHER';
  recordDate: string | Date;
  summary?: string;
  diagnosis?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}
