export interface MedicalDocument {
  _id: string;
  patientId: string | any;
  uploadedBy: string | any;
  title: string;
  type: 'MEDICAL_REPORT' | 'LAB_RESULT' | 'IMAGING' | 'PRESCRIPTION' | 'MEDICAL_CERTIFICATE' | 'INSURANCE' | 'IDENTITY' | 'OTHER';
  fileUrl: string;
  fileSizeMb?: number;
  uploadedDate: string | Date;
  notes?: string;
  createdAt?: string;
}
